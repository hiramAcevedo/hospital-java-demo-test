package com.hospital.citas.service;

import com.hospital.citas.dto.PacienteDTO;
import com.hospital.citas.model.Paciente;

import java.util.List;
import java.util.Optional;

public interface PacienteService {
    
    List<Paciente> obtenerTodosLosPacientes();
    
    Optional<Paciente> obtenerPacientePorId(Long id);
    
    Paciente guardarPaciente(PacienteDTO pacienteDTO);
    
    Paciente actualizarPaciente(Long id, PacienteDTO pacienteDTO);
    
    void eliminarPaciente(Long id);
} 