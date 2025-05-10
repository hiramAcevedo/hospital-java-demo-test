package com.hospital.citas.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitaDTO {
    
    private Long id;
    
    @NotNull(message = "El ID del consultorio es obligatorio")
    private Long consultorioId;
    
    @NotNull(message = "El ID del doctor es obligatorio")
    private Long doctorId;
    
    @NotNull(message = "El ID del paciente es obligatorio")
    private Long pacienteId;
    
    @NotNull(message = "El horario de consulta es obligatorio")
    @Future(message = "El horario de consulta debe ser en el futuro")
    private LocalDateTime horarioConsulta;
    
    private boolean activa = true;
    
    // Para respuestas
    private String nombrePaciente;
    private String apellidosPaciente;
    private String nombreDoctor;
    private String apellidoPaternoDoctor;
    private String apellidoMaternoDoctor;
    private String especialidadDoctor;
    private Integer numeroConsultorio;
    private Integer pisoConsultorio;
} 