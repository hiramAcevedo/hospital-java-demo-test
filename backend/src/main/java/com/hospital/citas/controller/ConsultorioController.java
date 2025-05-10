package com.hospital.citas.controller;

import com.hospital.citas.model.Consultorio;
import com.hospital.citas.service.ConsultorioService;
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
@RequestMapping("/api/consultorios")
@CrossOrigin
@Tag(name = "Consultorios", description = "API para gestionar consultorios")
public class ConsultorioController {

    private final ConsultorioService consultorioService;

    @Autowired
    public ConsultorioController(ConsultorioService consultorioService) {
        this.consultorioService = consultorioService;
    }

    @GetMapping
    @Operation(summary = "Obtener todos los consultorios")
    public ResponseEntity<List<Consultorio>> obtenerTodos() {
        List<Consultorio> consultorios = consultorioService.obtenerTodosLosConsultorios();
        return ResponseEntity.ok(consultorios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un consultorio por ID")
    public ResponseEntity<Consultorio> obtenerPorId(@PathVariable Long id) {
        Optional<Consultorio> consultorio = consultorioService.obtenerConsultorioPorId(id);
        return consultorio.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo consultorio")
    public ResponseEntity<Consultorio> crear(@Valid @RequestBody Consultorio consultorio) {
        Consultorio nuevoConsultorio = consultorioService.guardarConsultorio(consultorio);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoConsultorio);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un consultorio existente")
    public ResponseEntity<Consultorio> actualizar(@PathVariable Long id, @Valid @RequestBody Consultorio consultorio) {
        Optional<Consultorio> consultorioExistente = consultorioService.obtenerConsultorioPorId(id);
        
        if (consultorioExistente.isPresent()) {
            consultorio.setId(id);
            Consultorio consultorioActualizado = consultorioService.guardarConsultorio(consultorio);
            return ResponseEntity.ok(consultorioActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un consultorio")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Optional<Consultorio> consultorio = consultorioService.obtenerConsultorioPorId(id);
        
        if (consultorio.isPresent()) {
            consultorioService.eliminarConsultorio(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 