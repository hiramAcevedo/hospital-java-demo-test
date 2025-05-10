package com.hospital.citas.controller;

import com.hospital.citas.model.Doctor;
import com.hospital.citas.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctores")
@CrossOrigin
@Tag(name = "Doctores", description = "API para gestionar doctores")
public class DoctorController {

    private final DoctorService doctorService;

    @Autowired
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los doctores")
    public ResponseEntity<List<Doctor>> obtenerTodos() {
        List<Doctor> doctores = doctorService.obtenerTodosLosDoctores();
        return ResponseEntity.ok(doctores);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un doctor por ID")
    public ResponseEntity<Doctor> obtenerPorId(@PathVariable Long id) {
        Optional<Doctor> doctor = doctorService.obtenerDoctorPorId(id);
        return doctor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo doctor")
    public ResponseEntity<Doctor> crear(@Valid @RequestBody Doctor doctor) {
        Doctor nuevoDoctor = doctorService.guardarDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDoctor);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un doctor existente")
    public ResponseEntity<Doctor> actualizar(@PathVariable Long id, @Valid @RequestBody Doctor doctor) {
        Optional<Doctor> doctorExistente = doctorService.obtenerDoctorPorId(id);
        
        if (doctorExistente.isPresent()) {
            doctor.setId(id);
            Doctor doctorActualizado = doctorService.guardarDoctor(doctor);
            return ResponseEntity.ok(doctorActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un doctor")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Optional<Doctor> doctor = doctorService.obtenerDoctorPorId(id);
        
        if (doctor.isPresent()) {
            doctorService.eliminarDoctor(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 