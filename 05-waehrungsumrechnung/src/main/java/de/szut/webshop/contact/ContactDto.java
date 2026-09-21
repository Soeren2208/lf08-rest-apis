package de.szut.webshop.contact;

/** Die Anschrift, so wie sie in einer Antwort erscheint. */
public record ContactDto(
        String street,
        String postcode,
        String city,
        String phone) {
}
