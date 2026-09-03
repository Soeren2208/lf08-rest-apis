package de.szut.webshop.dto;

/**
 * Ein Lieferant, so wie ihn die Schnittstelle herausgibt.
 *
 * Die Artikel stehen NICHT drin - nur ihre Anzahl. Wer die Artikel braucht,
 * ruft den eigenen Endpunkt dafuer auf.
 */
public record SupplierDto(
        Long id,
        String name,
        ContactDto contact,
        long articleCount) {
}
