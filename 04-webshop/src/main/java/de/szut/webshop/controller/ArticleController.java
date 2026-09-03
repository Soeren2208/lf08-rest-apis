package de.szut.webshop.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import de.szut.webshop.dto.ArticleDto;
import de.szut.webshop.dto.CreateArticleDto;
import de.szut.webshop.service.ArticleService;
import jakarta.validation.Valid;

/**
 * Die Web-Schicht fuer Artikel.
 *
 * Die Adresse sagt, zu wem der Artikel gehoert:
 * /api/v1/suppliers/7/articles ist das Sortiment von Lieferant 7.
 */
@RestController
@RequestMapping("/api/v1/suppliers/{supplierId}/articles")
public class ArticleController {

    private final ArticleService service;

    public ArticleController(ArticleService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ArticleDto> createArticle(
            @PathVariable Long supplierId,
            @Valid @RequestBody CreateArticleDto dto) {

        ArticleDto created = service.create(supplierId, dto);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    @GetMapping
    public List<ArticleDto> findArticlesOfSupplier(@PathVariable Long supplierId) {
        return service.findAllBySupplier(supplierId);
    }
}
