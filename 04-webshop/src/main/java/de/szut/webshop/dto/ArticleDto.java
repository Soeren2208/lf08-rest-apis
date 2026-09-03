package de.szut.webshop.dto;

import java.math.BigDecimal;

/**
 * Ein Artikel, so wie ihn die Schnittstelle herausgibt.
 *
 * Statt des ganzen Lieferanten stehen hier nur seine Kennung und sein Name.
 * Damit endet die Kette - und die Antwort kann sich nicht mehr im Kreis drehen.
 */
public record ArticleDto(
        Long id,
        String designation,
        BigDecimal price,
        Long supplierId,
        String supplierName) {
}
