package com.hospital.citas.service.impl;

import com.hospital.citas.model.Doctor;
import com.hospital.citas.repository.DoctorRepository;
import com.hospital.citas.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public List<Doctor> obtenerTodosLosDoctores() {
        return doctorRepository.findAll();
    }

    @Override
    public Optional<Doctor> obtenerDoctorPorId(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    public Doctor guardarDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public void eliminarDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
} 