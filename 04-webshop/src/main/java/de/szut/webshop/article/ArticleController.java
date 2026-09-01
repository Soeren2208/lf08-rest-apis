package de.szut.webshop.article;

import de.szut.webshop.supplier.SupplierRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** PROBE-Stand: minimaler Endpunkt, um einen Artikel anzulegen. */
@RestController
@RequestMapping("/api/v1/suppliers/{supplierId}/articles")
public class ArticleController {

    private final ArticleRepository articleRepository;
    private final SupplierRepository supplierRepository;

    public ArticleController(ArticleRepository articleRepository,
                             SupplierRepository supplierRepository) {
        this.articleRepository = articleRepository;
        this.supplierRepository = supplierRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Article createArticle(@PathVariable Long supplierId,
                                 @RequestBody Article article) {
        article.setSupplier(supplierRepository.findById(supplierId).orElseThrow());
        return articleRepository.save(article);
    }
}
