package com.hospital.citas.service.impl;

import com.hospital.citas.dto.PacienteDTO;
import com.hospital.citas.model.Paciente;
import com.hospital.citas.repository.PacienteRepository;
import com.hospital.citas.service.PacienteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;

    @Autowired
    public PacienteServiceImpl(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    public List<Paciente> obtenerTodosLosPacientes() {
        return pacienteRepository.findAll();
    }

    @Override
    public Optional<Paciente> obtenerPacientePorId(Long id) {
        return pacienteRepository.findById(id);
    }

    @Override
    public Paciente guardarPaciente(PacienteDTO pacienteDTO) {
        Paciente paciente = new Paciente();
        paciente.setNombre(pacienteDTO.getNombre());
        paciente.setApellidos(pacienteDTO.getApellidos());
        return pacienteRepository.save(paciente);
    }

    @Override
    public Paciente actualizarPaciente(Long id, PacienteDTO pacienteDTO) {
        return pacienteRepository.findById(id)
                .map(paciente -> {
                    paciente.setNombre(pacienteDTO.getNombre());
                    paciente.setApellidos(pacienteDTO.getApellidos());
                    return pacienteRepository.save(paciente);
                })
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado con id: " + id));
    }

    @Override
    public void eliminarPaciente(Long id) {
        pacienteRepository.deleteById(id);
    }
} 