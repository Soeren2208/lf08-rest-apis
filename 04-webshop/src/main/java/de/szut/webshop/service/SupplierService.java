package de.szut.webshop.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.szut.webshop.dto.CreateSupplierDto;
import de.szut.webshop.dto.SupplierDto;
import de.szut.webshop.model.Supplier;
import de.szut.webshop.repository.ArticleRepository;
import de.szut.webshop.repository.SupplierRepository;

/**
 * Die Fachlichkeit rund um Lieferanten.
 *
 * Hier steht, WAS geschieht. Wie es hereinkommt (HTTP) und wo es landet
 * (Datenbank) steht woanders.
 */
@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final ArticleRepository articleRepository;
    private final SupplierMapper mapper;

    public SupplierService(SupplierRepository supplierRepository,
                           ArticleRepository articleRepository,
                           SupplierMapper mapper) {
        this.supplierRepository = supplierRepository;
        this.articleRepository = articleRepository;
        this.mapper = mapper;
    }

    @Transactional
    public SupplierDto create(CreateSupplierDto dto) {
        Supplier saved = supplierRepository.save(mapper.toEntity(dto));
        return mapper.toDto(saved, 0);
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> findAll() {
        return supplierRepository.findAll().stream()
                .map(supplier -> mapper.toDto(
                        supplier,
                        articleRepository.countBySupplierId(supplier.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public SupplierDto findById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new SupplierNotFoundException(id));
        return mapper.toDto(supplier, articleRepository.countBySupplierId(id));
    }

    /**
     * Loescht einen Lieferanten - aber nur, wenn er keine Artikel mehr hat.
     *
     * Die Anschrift verschwindet dabei mit: Das ist die gefuellte Raute aus
     * dem Klassendiagramm, in Java als cascade = ALL.
     */
    @Transactional
    public void deleteById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new SupplierNotFoundException(id));

        long articleCount = articleRepository.countBySupplierId(id);
        if (articleCount > 0) {
            throw new SupplierHasArticlesException(id, articleCount);
        }

        supplierRepository.delete(supplier);
    }

    /**
     * Liefert die Entitaet - nur fuer andere Services gedacht, nicht fuer
     * den Controller. Nach aussen geht ausschliesslich ein DTO.
     */
    @Transactional(readOnly = true)
    public Supplier getEntity(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new SupplierNotFoundException(id));
    }
}
