package de.szut.webshop.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Ein Artikel, so wie ein Client ihn anlegt.
 *
 * Der Lieferant steht nicht im Rumpf - er steht in der Adresse:
 * POST /api/v1/suppliers/7/articles
 */
public record CreateArticleDto(

        @NotBlank(message = "Die Bezeichnung darf nicht leer sein.")
        String designation,

        @NotNull(message = "Ein Artikel braucht einen Preis.")
        @Positive(message = "Der Preis muss größer als 0 sein.")
        BigDecimal price) {
}
