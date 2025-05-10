package com.hospital.citas.service.impl;

import com.hospital.citas.dto.CitaDTO;
import com.hospital.citas.model.Cita;
import com.hospital.citas.model.Consultorio;
import com.hospital.citas.model.Doctor;
import com.hospital.citas.model.Paciente;
import com.hospital.citas.repository.CitaRepository;
import com.hospital.citas.repository.ConsultorioRepository;
import com.hospital.citas.repository.DoctorRepository;
import com.hospital.citas.repository.PacienteRepository;
import com.hospital.citas.service.CitaService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitaServiceImpl implements CitaService {

    private final CitaRepository citaRepository;
    private final DoctorRepository doctorRepository;
    private final ConsultorioRepository consultorioRepository;
    private final PacienteRepository pacienteRepository;

    @Autowired
    public CitaServiceImpl(CitaRepository citaRepository, 
                          DoctorRepository doctorRepository, 
                          ConsultorioRepository consultorioRepository, 
                          PacienteRepository pacienteRepository) {
        this.citaRepository = citaRepository;
        this.doctorRepository = doctorRepository;
        this.consultorioRepository = consultorioRepository;
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    @Transactional
    public CitaDTO crearCita(CitaDTO citaDTO) {
        // Obtener entidades desde los ids
        Doctor doctor = doctorRepository.findById(citaDTO.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor no encontrado con id: " + citaDTO.getDoctorId()));
        
        Consultorio consultorio = consultorioRepository.findById(citaDTO.getConsultorioId())
                .orElseThrow(() -> new EntityNotFoundException("Consultorio no encontrado con id: " + citaDTO.getConsultorioId()));
        
        Paciente paciente = pacienteRepository.findById(citaDTO.getPacienteId())
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado con id: " + citaDTO.getPacienteId()));
        
        LocalDateTime horarioCita = citaDTO.getHorarioConsulta();
        LocalDate fechaCita = horarioCita.toLocalDate();
        
        // Validación: No se puede agendar cita en un mismo consultorio a la misma hora.
        // Validación: No se puede agendar cita para un mismo Dr. a la misma hora.
        // Estas validaciones están implementadas como restricciones de unicidad en la BD
        
        // Validación: No se puede agendar cita para un paciente a una misma hora ni con menos de 2 horas de diferencia para el mismo día.
        LocalDateTime dosPrevias = horarioCita.minusHours(2);
        LocalDateTime dosPosterior = horarioCita.plusHours(2);
        
        List<Cita> citasConflictoPaciente = citaRepository.findByPacienteAndRangoHorario(
                paciente.getId(), 
                LocalDateTime.of(fechaCita, LocalTime.MIN), 
                LocalDateTime.of(fechaCita, LocalTime.MAX)
        );
        
        for (Cita cita : citasConflictoPaciente) {
            LocalDateTime horarioExistente = cita.getHorarioConsulta();
            if (horarioExistente.isAfter(dosPrevias) && horarioExistente.isBefore(dosPosterior)) {
                throw new ValidationException("El paciente ya tiene una cita programada dentro del rango de 2 horas de la hora solicitada");
            }
        }
        
        // Validación: Un mismo doctor no puede tener más de 8 citas en el día.
        int citasDoctor = citaRepository.countByDoctorAndFecha(doctor.getId(), fechaCita);
        if (citasDoctor >= 8) {
            throw new ValidationException("El doctor ya tiene el máximo de 8 citas para el día solicitado");
        }
        
        // Crear y guardar la nueva cita
        Cita nuevaCita = new Cita();
        nuevaCita.setDoctor(doctor);
        nuevaCita.setConsultorio(consultorio);
        nuevaCita.setPaciente(paciente);
        nuevaCita.setHorarioConsulta(horarioCita);
        nuevaCita.setActiva(true);
        
        Cita citaGuardada = citaRepository.save(nuevaCita);
        
        return mapearCitaACitaDTO(citaGuardada);
    }

    @Override
    @Transactional
    public CitaDTO actualizarCita(Long id, CitaDTO citaDTO) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + id));
        
        // Si la cita ya fue cancelada o sucedió en el pasado, no se puede actualizar
        if (!cita.isActiva() || cita.getHorarioConsulta().isBefore(LocalDateTime.now())) {
            throw new ValidationException("No se puede actualizar una cita cancelada o que ya sucedió");
        }
        
        // Actualizar la cita como si fuera nueva, aplicando todas las validaciones
        citaDTO.setId(id);
        // Primero cancelamos la cita actual
        cita.setActiva(false);
        citaRepository.save(cita);
        // Luego creamos una nueva
        return crearCita(citaDTO);
    }

    @Override
    @Transactional
    public boolean cancelarCita(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + id));
        
        // Solo se pueden cancelar citas futuras y activas
        if (cita.getHorarioConsulta().isBefore(LocalDateTime.now())) {
            throw new ValidationException("No se puede cancelar una cita que ya sucedió");
        }
        
        if (!cita.isActiva()) {
            throw new ValidationException("La cita ya está cancelada");
        }
        
        cita.setActiva(false);
        citaRepository.save(cita);
        return true;
    }

    @Override
    public CitaDTO obtenerCitaPorId(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada con id: " + id));
        return mapearCitaACitaDTO(cita);
    }

    @Override
    public List<CitaDTO> obtenerTodasLasCitas() {
        return citaRepository.findAll().stream()
                .map(this::mapearCitaACitaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaDTO> obtenerCitasPorFecha(LocalDate fecha) {
        return citaRepository.findByFecha(fecha).stream()
                .map(this::mapearCitaACitaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaDTO> obtenerCitasPorDoctorYFecha(Long doctorId, LocalDate fecha) {
        return citaRepository.findByDoctorAndFecha(doctorId, fecha).stream()
                .map(this::mapearCitaACitaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaDTO> obtenerCitasPorConsultorioYFecha(Long consultorioId, LocalDate fecha) {
        return citaRepository.findByConsultorioAndFecha(consultorioId, fecha).stream()
                .map(this::mapearCitaACitaDTO)
                .collect(Collectors.toList());
    }

    // Método auxiliar para convertir entidad a DTO
    private CitaDTO mapearCitaACitaDTO(Cita cita) {
        CitaDTO citaDTO = new CitaDTO();
        citaDTO.setId(cita.getId());
        citaDTO.setConsultorioId(cita.getConsultorio().getId());
        citaDTO.setDoctorId(cita.getDoctor().getId());
        citaDTO.setPacienteId(cita.getPaciente().getId());
        citaDTO.setHorarioConsulta(cita.getHorarioConsulta());
        citaDTO.setActiva(cita.isActiva());
        
        // Información adicional para mostrar
        citaDTO.setNombrePaciente(cita.getPaciente().getNombre());
        citaDTO.setApellidosPaciente(cita.getPaciente().getApellidos());
        citaDTO.setNombreDoctor(cita.getDoctor().getNombre());
        citaDTO.setApellidoPaternoDoctor(cita.getDoctor().getApellidoPaterno());
        citaDTO.setApellidoMaternoDoctor(cita.getDoctor().getApellidoMaterno());
        citaDTO.setEspecialidadDoctor(cita.getDoctor().getEspecialidad());
        citaDTO.setNumeroConsultorio(cita.getConsultorio().getNumeroConsultorio());
        citaDTO.setPisoConsultorio(cita.getConsultorio().getPiso());
        
        return citaDTO;
    }
} 