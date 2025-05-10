package com.hospital.citas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "consultorios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El número de consultorio es obligatorio")
    @Column(name = "numero_consultorio", unique = true)
    private Integer numeroConsultorio;

    @NotNull(message = "El piso es obligatorio")
    @Min(value = 1, message = "El piso debe ser mayor a 0")
    private Integer piso;
} 