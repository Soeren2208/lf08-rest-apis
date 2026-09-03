package de.szut.webshop.service;

import org.springframework.stereotype.Component;

import de.szut.webshop.dto.ArticleDto;
import de.szut.webshop.dto.CreateArticleDto;
import de.szut.webshop.model.Article;
import de.szut.webshop.model.Supplier;

/** Uebersetzt zwischen Article und den beiden Artikel-DTOs. */
@Component
public class ArticleMapper {

    /**
     * Entitaet -> Antwort.
     *
     * Vom Lieferanten wandern nur zwei Felder mit. Damit ist die Kette zu
     * Ende: Das ArticleDto enthaelt keinen Lieferanten, der wieder Artikel
     * enthaelt.
     */
    public ArticleDto toDto(Article article) {
        Supplier supplier = article.getSupplier();
        return new ArticleDto(
                article.getId(),
                article.getDesignation(),
                article.getPrice(),
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
