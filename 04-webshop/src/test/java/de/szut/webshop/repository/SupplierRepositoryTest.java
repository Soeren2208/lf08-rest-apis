package de.szut.webshop.repository;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import de.szut.webshop.model.Article;
import de.szut.webshop.model.Contact;
import de.szut.webshop.model.Supplier;

/**
 * Die Datenzugriffsschicht gegen die ECHTE Datenbank im Container.
 *
 * Anders als im Gaestebuch-Tutorial wird die Datenbank hier NICHT durch eine
 * im Arbeitsspeicher ersetzt: Genau das Verhalten der PostgreSQL ist ja der
 * Gegenstand - Fremdschluessel, Eindeutigkeit, Kaskaden.
 *
 * Der Container muss laufen. Jeder Test wird am Ende zurueckgerollt.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DisplayName("Lieferanten in der Datenbank")
class SupplierRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ArticleRepository articleRepository;

    private Supplier newSupplier(String name) {
        Contact contact = new Contact();
        contact.setStreet("Hafenstr. 12");
        contact.setPostcode("28217");
        contact.setCity("Bremen");

        Supplier supplier = new Supplier();
        supplier.setName(name);
        supplier.setContact(contact);
        return supplier;
    }

    @Test
    @DisplayName("speichert die Anschrift mit, ohne dass man sie einzeln speichert")
    void savingSupplierCascadesToContact() {
        Supplier saved = supplierRepository.save(newSupplier("Testlauf GmbH"));
        entityManager.flush();

        assertThat(saved.getContact().getId()).isNotNull();
    }

    @Test
    @DisplayName("loescht die Anschrift mit dem Lieferanten - die gefuellte Raute")
    void deletingSupplierRemovesContact() {
        Supplier saved = supplierRepository.save(newSupplier("Testlauf GmbH"));
        entityManager.flush();
        Long contactId = saved.getContact().getId();

        supplierRepository.delete(saved);
        entityManager.flush();
        entityManager.clear();

        assertThat(entityManager.find(Contact.class, contactId)).isNull();
    }

    @Test
    @DisplayName("findet die Artikel eines Lieferanten und zaehlt sie")
    void findsAndCountsArticlesOfSupplier() {
        Supplier supplier = supplierRepository.save(newSupplier("Testlauf GmbH"));

        Article article = new Article();
        article.setDesignation("Schraube M6");
        article.setPrice(new BigDecimal("0.45"));
        article.setSupplier(supplier);
        articleRepository.save(article);
        entityManager.flush();

        assertThat(articleRepository.findAllBySupplierIdOrderByIdDesc(supplier.getId()))
                .hasSize(1);
        assertThat(articleRepository.countBySupplierId(supplier.getId())).isEqualTo(1);
    }
}
