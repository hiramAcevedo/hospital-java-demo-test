package com.hospital.citas.repository;

import com.hospital.citas.model.Cita;
import com.hospital.citas.model.Consultorio;
import com.hospital.citas.model.Doctor;
import com.hospital.citas.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    
    // Obtener citas por fecha
    @Query("SELECT c FROM Cita c WHERE DATE(c.horarioConsulta) = :fecha AND c.activa = true")
    List<Cita> findByFecha(@Param("fecha") LocalDate fecha);
    
    // Obtener citas por doctor y fecha
    @Query("SELECT c FROM Cita c WHERE c.doctor.id = :doctorId AND DATE(c.horarioConsulta) = :fecha AND c.activa = true")
    List<Cita> findByDoctorAndFecha(@Param("doctorId") Long doctorId, @Param("fecha") LocalDate fecha);
    
    // Obtener citas por consultorio y fecha
    @Query("SELECT c FROM Cita c WHERE c.consultorio.id = :consultorioId AND DATE(c.horarioConsulta) = :fecha AND c.activa = true")
    List<Cita> findByConsultorioAndFecha(@Param("consultorioId") Long consultorioId, @Param("fecha") LocalDate fecha);
    
    // Contar citas por doctor y fecha
    @Query("SELECT COUNT(c) FROM Cita c WHERE c.doctor.id = :doctorId AND DATE(c.horarioConsulta) = :fecha AND c.activa = true")
    int countByDoctorAndFecha(@Param("doctorId") Long doctorId, @Param("fecha") LocalDate fecha);
    
    // Buscar citas por paciente y rango de horas
    @Query("SELECT c FROM Cita c WHERE c.paciente.id = :pacienteId AND c.horarioConsulta BETWEEN :inicio AND :fin AND c.activa = true")
    List<Cita> findByPacienteAndRangoHorario(@Param("pacienteId") Long pacienteId, 
                                            @Param("inicio") LocalDateTime inicio, 
                                            @Param("fin") LocalDateTime fin);
    
    List<Cita> findByDoctor(Doctor doctor);
    
    List<Cita> findByConsultorio(Consultorio consultorio);
    
    List<Cita> findByPaciente(Paciente paciente);
} 