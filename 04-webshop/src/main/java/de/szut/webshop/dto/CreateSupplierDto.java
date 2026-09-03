package de.szut.webshop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Ein Lieferant, so wie ein Client ihn anlegt.
 *
 * Keine id: Die vergibt die Datenbank. Keine Artikel: Die kommen spaeter
 * ueber einen eigenen Endpunkt dazu.
 */
public record CreateSupplierDto(

        @NotBlank(message = "Der Name darf nicht leer sein.")
        String name,

        @NotNull(message = "Zu einem Lieferanten gehört eine Anschrift.")
        @Valid
        CreateContactDto contact) {
}
