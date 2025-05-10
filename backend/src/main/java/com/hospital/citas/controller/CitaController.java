package com.hospital.citas.controller;

import com.hospital.citas.dto.CitaDTO;
import com.hospital.citas.service.CitaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin
@Tag(name = "Citas", description = "API para gestionar citas médicas")
public class CitaController {

    private final CitaService citaService;

    @Autowired
    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    @Operation(summary = "Obtener todas las citas")
    public ResponseEntity<List<CitaDTO>> obtenerTodasLasCitas() {
        List<CitaDTO> citas = citaService.obtenerTodasLasCitas();
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una cita por ID")
    public ResponseEntity<CitaDTO> obtenerCitaPorId(@PathVariable Long id) {
        try {
            CitaDTO cita = citaService.obtenerCitaPorId(id);
            return ResponseEntity.ok(cita);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/fecha/{fecha}")
    @Operation(summary = "Obtener citas por fecha")
    public ResponseEntity<List<CitaDTO>> obtenerCitasPorFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<CitaDTO> citas = citaService.obtenerCitasPorFecha(fecha);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/doctor/{doctorId}/fecha/{fecha}")
    @Operation(summary = "Obtener citas por doctor y fecha")
    public ResponseEntity<List<CitaDTO>> obtenerCitasPorDoctorYFecha(
            @PathVariable Long doctorId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<CitaDTO> citas = citaService.obtenerCitasPorDoctorYFecha(doctorId, fecha);
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/consultorio/{consultorioId}/fecha/{fecha}")
    @Operation(summary = "Obtener citas por consultorio y fecha")
    public ResponseEntity<List<CitaDTO>> obtenerCitasPorConsultorioYFecha(
            @PathVariable Long consultorioId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<CitaDTO> citas = citaService.obtenerCitasPorConsultorioYFecha(consultorioId, fecha);
        return ResponseEntity.ok(citas);
    }

    @PostMapping
    @Operation(summary = "Crear una nueva cita")
    public ResponseEntity<?> crearCita(@Valid @RequestBody CitaDTO citaDTO) {
        try {
            CitaDTO nuevaCita = citaService.crearCita(citaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCita);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una cita existente")
    public ResponseEntity<?> actualizarCita(@PathVariable Long id, @Valid @RequestBody CitaDTO citaDTO) {
        try {
            CitaDTO citaActualizada = citaService.actualizarCita(id, citaDTO);
            return ResponseEntity.ok(citaActualizada);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar una cita")
    public ResponseEntity<?> cancelarCita(@PathVariable Long id) {
        try {
            boolean resultado = citaService.cancelarCita(id);
            if (resultado) {
                return ResponseEntity.ok().body("Cita cancelada exitosamente");
            } else {
                return ResponseEntity.badRequest().body("No se pudo cancelar la cita");
            }
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
} 