package de.szut.webshop.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.szut.webshop.dto.ArticleDto;
import de.szut.webshop.dto.CreateArticleDto;
import de.szut.webshop.model.Article;
import de.szut.webshop.model.Supplier;
import de.szut.webshop.repository.ArticleRepository;

/** Die Fachlichkeit rund um Artikel. */
@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final SupplierService supplierService;
    private final ArticleMapper mapper;

    public ArticleService(ArticleRepository articleRepository,
                          SupplierService supplierService,
                          ArticleMapper mapper) {
        this.articleRepository = articleRepository;
        this.supplierService = supplierService;
        this.mapper = mapper;
    }

    /** Legt einen Artikel an. Gibt es den Lieferanten nicht, gibt es auch keinen Artikel. */
    @Transactional
    public ArticleDto create(Long supplierId, CreateArticleDto dto) {
        Supplier supplier = supplierService.getEntity(supplierId);
        Article saved = articleRepository.save(mapper.toEntity(dto, supplier));
        return mapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ArticleDto> findAllBySupplier(Long supplierId) {
        // Wirft, wenn es den Lieferanten nicht gibt - eine leere Liste waere
        // hier die falsche Antwort: Sie behauptet, der Lieferant existiere.
        supplierService.getEntity(supplierId);

        return articleRepository.findAllBySupplierIdOrderByIdDesc(supplierId).stream()
                .map(mapper::toDto)
                .toList();
    }
}
