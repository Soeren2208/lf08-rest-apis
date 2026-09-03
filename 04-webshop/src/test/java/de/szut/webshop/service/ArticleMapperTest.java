package de.szut.webshop.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import de.szut.webshop.dto.ArticleDto;
import de.szut.webshop.dto.CreateArticleDto;
import de.szut.webshop.model.Article;
import de.szut.webshop.model.Supplier;

/**
 * Der Mapper ist reines Java: kein Spring, keine Datenbank, kein HTTP.
 * Deshalb laeuft dieser Test in Millisekunden.
 */
@DisplayName("ArticleMapper")
class ArticleMapperTest {

    private final ArticleMapper mapper = new ArticleMapper();

    private Supplier sampleSupplier() {
        Supplier supplier = new Supplier();
        supplier.setId(7L);
        supplier.setName("Testlauf GmbH");
        return supplier;
    }

    @Test
    @DisplayName("nimmt vom Lieferanten nur Kennung und Name mit")
    void toDtoFlattensSupplier() {
        Article article = new Article();
        article.setId(1L);
        article.setDesignation("Schraube M6");
        article.setPrice(new BigDecimal("0.45"));
        article.setSupplier(sampleSupplier());

        ArticleDto dto = mapper.toDto(article);

        assertThat(dto.id()).isEqualTo(1L);
        assertThat(dto.designation()).isEqualTo("Schraube M6");
        assertThat(dto.price()).isEqualByComparingTo("0.45");
        assertThat(dto.supplierId()).isEqualTo(7L);
        assertThat(dto.supplierName()).isEqualTo("Testlauf GmbH");
    }

    @Test
    @DisplayName("haengt den Artikel an den uebergebenen Lieferanten")
    void toEntitySetsSupplier() {
        CreateArticleDto dto = new CreateArticleDto("Mutter M6", new BigDecimal("0.12"));
        Supplier supplier = sampleSupplier();

        Article article = mapper.toEntity(dto, supplier);

        assertThat(article.getDesignation()).isEqualTo("Mutter M6");
        assertThat(article.getPrice()).isEqualByComparingTo("0.12");
        assertThat(article.getSupplier()).isSameAs(supplier);
        assertThat(article.getId()).isNull();
    }
}
