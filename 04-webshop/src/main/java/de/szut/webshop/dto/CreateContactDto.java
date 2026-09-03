package de.szut.webshop.dto;

import jakarta.validation.constraints.NotBlank;

/** Die Anschrift, so wie ein Client sie mitschickt. */
public record CreateContactDto(

        @NotBlank(message = "Die Straße darf nicht leer sein.")
        String street,

        @NotBlank(message = "Die Postleitzahl darf nicht leer sein.")
        String postcode,

        @NotBlank(message = "Der Ort darf nicht leer sein.")
        String city,

        String phone) {
}
