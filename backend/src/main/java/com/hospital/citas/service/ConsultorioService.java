package com.hospital.citas.service;

import com.hospital.citas.model.Consultorio;

import java.util.List;
import java.util.Optional;

public interface ConsultorioService {
    
    List<Consultorio> obtenerTodosLosConsultorios();
    
    Optional<Consultorio> obtenerConsultorioPorId(Long id);
    
    Consultorio guardarConsultorio(Consultorio consultorio);
    
    void eliminarConsultorio(Long id);
} 