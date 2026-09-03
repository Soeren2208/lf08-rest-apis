package de.szut.webshop.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import de.szut.webshop.model.Supplier;
import de.szut.webshop.repository.ArticleRepository;
import de.szut.webshop.repository.SupplierRepository;

/**
 * Die Regel "Lieferant mit Artikeln wird nicht geloescht" laesst sich ohne
 * Datenbank pruefen - die beiden Repositories sind Doppel.
 */
@DisplayName("SupplierService")
class SupplierServiceTest {

    private SupplierRepository supplierRepository;
    private ArticleRepository articleRepository;
    private SupplierService service;

    @BeforeEach
    void setUp() {
        supplierRepository = mock(SupplierRepository.class);
        articleRepository = mock(ArticleRepository.class);
        service = new SupplierService(supplierRepository, articleRepository, new SupplierMapper());
    }

    private Supplier sampleSupplier() {
        Supplier supplier = new Supplier();
        supplier.setId(1L);
        supplier.setName("Testlauf GmbH");
        return supplier;
    }

    @Test
    @DisplayName("loescht einen Lieferanten ohne Artikel")
    void deleteRemovesSupplierWithoutArticles() {
        Supplier supplier = sampleSupplier();
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));
        when(articleRepository.countBySupplierId(1L)).thenReturn(0L);

        service.deleteById(1L);

        verify(supplierRepository).delete(supplier);
    }

    @Test
    @DisplayName("verweigert das Loeschen, solange Artikel da sind")
    void deleteRefusesWhenArticlesExist() {
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(sampleSupplier()));
        when(articleRepository.countBySupplierId(1L)).thenReturn(3L);

        assertThatThrownBy(() -> service.deleteById(1L))
                .isInstanceOf(SupplierHasArticlesException.class)
                .hasMessageContaining("3 Artikel");

        verify(supplierRepository, never()).delete(any());
    }

    @Test
    @DisplayName("meldet einen unbekannten Lieferanten")
    void findByIdThrowsWhenUnknown() {
        when(supplierRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(42L))
                .isInstanceOf(SupplierNotFoundException.class)
                .hasMessageContaining("42");
    }

    @Test
    @DisplayName("zaehlt die Artikel, statt sie zu laden")
    void findByIdCountsArticles() {
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(sampleSupplier()));
        when(articleRepository.countBySupplierId(1L)).thenReturn(5L);

        assertThat(service.findById(1L).articleCount()).isEqualTo(5L);
    }
}
