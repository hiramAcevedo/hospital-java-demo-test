package com.hospital.citas.controller;

import com.hospital.citas.dto.PacienteDTO;
import com.hospital.citas.model.Paciente;
import com.hospital.citas.service.PacienteService;
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
@RequestMapping("/api/pacientes")
@CrossOrigin
@Tag(name = "Pacientes", description = "API para gestionar pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    @Autowired
    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los pacientes")
    public ResponseEntity<List<Paciente>> obtenerTodos() {
        List<Paciente> pacientes = pacienteService.obtenerTodosLosPacientes();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un paciente por ID")
    public ResponseEntity<Paciente> obtenerPorId(@PathVariable Long id) {
        Optional<Paciente> paciente = pacienteService.obtenerPacientePorId(id);
        return paciente.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo paciente")
    public ResponseEntity<Paciente> crear(@Valid @RequestBody PacienteDTO pacienteDTO) {
        Paciente nuevoPaciente = pacienteService.guardarPaciente(pacienteDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPaciente);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un paciente existente")
    public ResponseEntity<Paciente> actualizar(@PathVariable Long id, @Valid @RequestBody PacienteDTO pacienteDTO) {
        try {
            Paciente pacienteActualizado = pacienteService.actualizarPaciente(id, pacienteDTO);
            return ResponseEntity.ok(pacienteActualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un paciente")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Optional<Paciente> paciente = pacienteService.obtenerPacientePorId(id);
        
        if (paciente.isPresent()) {
            pacienteService.eliminarPaciente(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 