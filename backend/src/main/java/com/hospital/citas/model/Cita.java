package com.hospital.citas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "citas", uniqueConstraints = {
    @UniqueConstraint(name = "UK_doctor_horario", columnNames = {"doctor_id", "horario_consulta"}),
    @UniqueConstraint(name = "UK_consultorio_horario", columnNames = {"consultorio_id", "horario_consulta"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consultorio_id", nullable = false)
    @NotNull(message = "El consultorio es obligatorio")
    private Consultorio consultorio;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @NotNull(message = "El doctor es obligatorio")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    @NotNull(message = "El paciente es obligatorio")
    private Paciente paciente;

    @NotNull(message = "El horario de consulta es obligatorio")
    @Column(name = "horario_consulta")
    private LocalDateTime horarioConsulta;

    private boolean activa = true;
} 