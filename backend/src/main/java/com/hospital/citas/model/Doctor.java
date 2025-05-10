package com.hospital.citas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido paterno es obligatorio")
    @Column(name = "apellido_paterno")
    private String apellidoPaterno;

    @NotBlank(message = "El apellido materno es obligatorio")
    @Column(name = "apellido_materno")
    private String apellidoMaterno;

    @NotBlank(message = "La especialidad es obligatoria")
    private String especialidad;
} 