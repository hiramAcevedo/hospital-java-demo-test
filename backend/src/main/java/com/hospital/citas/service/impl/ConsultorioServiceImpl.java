package com.hospital.citas.service.impl;

import com.hospital.citas.model.Consultorio;
import com.hospital.citas.repository.ConsultorioRepository;
import com.hospital.citas.service.ConsultorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultorioServiceImpl implements ConsultorioService {

    private final ConsultorioRepository consultorioRepository;

    @Autowired
    public ConsultorioServiceImpl(ConsultorioRepository consultorioRepository) {
        this.consultorioRepository = consultorioRepository;
    }

    @Override
    public List<Consultorio> obtenerTodosLosConsultorios() {
        return consultorioRepository.findAll();
    }

    @Override
    public Optional<Consultorio> obtenerConsultorioPorId(Long id) {
        return consultorioRepository.findById(id);
    }

    @Override
    public Consultorio guardarConsultorio(Consultorio consultorio) {
        return consultorioRepository.save(consultorio);
    }

    @Override
    public void eliminarConsultorio(Long id) {
        consultorioRepository.deleteById(id);
    }
} 