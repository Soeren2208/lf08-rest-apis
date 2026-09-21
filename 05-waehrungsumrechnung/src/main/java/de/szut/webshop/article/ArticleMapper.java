package de.szut.webshop.article;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import de.szut.webshop.supplier.Supplier;

/** Uebersetzt zwischen Article und den beiden Artikel-DTOs. */
@Component
public class ArticleMapper {

    /** Entitaet -> Antwort, unveraendert in Euro. */
    public ArticleDto toDto(Article article) {
        return toDto(article, "EUR", article.getPrice());
    }

    /**
     * Entitaet -> Antwort, mit einem bereits umgerechneten Preis.
     *
     * Vom Lieferanten wandern nur zwei Felder mit. Damit ist die Kette zu
     * Ende: Das ArticleDto enthaelt keinen Lieferanten, der wieder Artikel
     * enthaelt.
     */
    public ArticleDto toDto(Article article, String currency, BigDecimal price) {
        Supplier supplier = article.getSupplier();
        return new ArticleDto(
                article.getId(),
                article.getDesignation(),
                price,
                currency,
                supplier.getId(),
                supplier.getName());
    }

    /** Anfrage -> Entitaet. Der Lieferant kommt aus der Adresse, nicht aus dem Rumpf. */
    public Article toEntity(CreateArticleDto dto, Supplier supplier) {
        Article article = new Article();
        article.setDesignation(dto.designation());
        article.setPrice(dto.price());
        article.setSupplier(supplier);
        return article;
    }
}
