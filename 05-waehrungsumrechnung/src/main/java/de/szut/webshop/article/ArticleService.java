package de.szut.webshop.article;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.szut.webshop.exchangerate.ExchangerateService;
import de.szut.webshop.supplier.Supplier;
import de.szut.webshop.supplier.SupplierService;

/** Die Fachlichkeit rund um Artikel. */
@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final SupplierService supplierService;
    private final ArticleMapper mapper;
    private final ExchangerateService exchangerateService;

    public ArticleService(ArticleRepository articleRepository,
                          SupplierService supplierService,
                          ArticleMapper mapper,
                          ExchangerateService exchangerateService) {
        this.articleRepository = articleRepository;
        this.supplierService = supplierService;
        this.mapper = mapper;
        this.exchangerateService = exchangerateService;
    }

    /** Legt einen Artikel an. Gibt es den Lieferanten nicht, gibt es auch keinen Artikel. */
    @Transactional
    public ArticleDto create(Long supplierId, CreateArticleDto dto) {
        Supplier supplier = supplierService.getEntity(supplierId);
        Article saved = articleRepository.save(mapper.toEntity(dto, supplier));
        return mapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ArticleDto> findAllBySupplier(Long supplierId, String currency) {
        // Wirft, wenn es den Lieferanten nicht gibt - eine leere Liste waere
        // hier die falsche Antwort: Sie behauptet, der Lieferant existiere.
        supplierService.getEntity(supplierId);

        return articleRepository.findAllBySupplierIdOrderByIdDesc(supplierId).stream()
                .map(article -> toDto(article, currency))
                .toList();
    }

    @Transactional(readOnly = true)
    public ArticleDto findById(Long supplierId, Long id, String currency) {
        supplierService.getEntity(supplierId);

        Article article = articleRepository.findById(id)
                .filter(a -> a.getSupplier().getId().equals(supplierId))
                .orElseThrow(() -> new ArticleNotFoundException(id));

        return toDto(article, currency);
    }

    /** EUR wird nie umgerechnet - dafuer braucht es keinen Aufruf der fremden API. */
    private ArticleDto toDto(Article article, String currency) {
        String normalized = currency.toUpperCase();
        if (normalized.equals("EUR")) {
            return mapper.toDto(article);
        }

        var convertedPrice = exchangerateService.convert(article.getPrice(), normalized);
        return mapper.toDto(article, normalized, convertedPrice);
    }
}
