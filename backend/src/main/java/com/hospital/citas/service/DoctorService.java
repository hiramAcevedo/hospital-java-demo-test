package com.hospital.citas.service;

import com.hospital.citas.model.Doctor;

import java.util.List;
import java.util.Optional;

public interface DoctorService {
    
    List<Doctor> obtenerTodosLosDoctores();
    
    Optional<Doctor> obtenerDoctorPorId(Long id);
    
    Doctor guardarDoctor(Doctor doctor);
    
    void eliminarDoctor(Long id);
} 