package com.hospital.citas.service;

import com.hospital.citas.dto.CitaDTO;

import java.time.LocalDate;
import java.util.List;

public interface CitaService {
    
    CitaDTO crearCita(CitaDTO citaDTO);
    
    CitaDTO actualizarCita(Long id, CitaDTO citaDTO);
    
    boolean cancelarCita(Long id);
    
    CitaDTO obtenerCitaPorId(Long id);
    
    List<CitaDTO> obtenerTodasLasCitas();
    
    List<CitaDTO> obtenerCitasPorFecha(LocalDate fecha);
    
    List<CitaDTO> obtenerCitasPorDoctorYFecha(Long doctorId, LocalDate fecha);
    
    List<CitaDTO> obtenerCitasPorConsultorioYFecha(Long consultorioId, LocalDate fecha);
} 