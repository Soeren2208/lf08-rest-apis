package de.szut.webshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import de.szut.webshop.model.Article;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    /** Alle Artikel eines Lieferanten, neueste zuerst. */
    List<Article> findAllBySupplierIdOrderByIdDesc(Long supplierId);

    /** Zaehlt, ohne die Artikel zu laden. */
    long countBySupplierId(Long supplierId);
}
