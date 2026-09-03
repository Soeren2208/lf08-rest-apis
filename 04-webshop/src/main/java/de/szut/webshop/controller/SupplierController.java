package de.szut.webshop.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import de.szut.webshop.dto.CreateSupplierDto;
import de.szut.webshop.dto.SupplierDto;
import de.szut.webshop.service.SupplierService;
import jakarta.validation.Valid;

/**
 * Die Web-Schicht fuer Lieferanten.
 *
 * Jede Methode macht dasselbe Dreierlei: entgegennehmen, weiterreichen,
 * mit einem Statuscode antworten. Fachlichkeit steht hier keine.
 */
@RestController
@RequestMapping("/api/v1/suppliers")
public class SupplierController {

    private final SupplierService service;

    public SupplierController(SupplierService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SupplierDto> createSupplier(
            @Valid @RequestBody CreateSupplierDto dto) {

        SupplierDto created = service.create(dto);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    @GetMapping
    public List<SupplierDto> findAllSuppliers() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SupplierDto findSupplierById(@PathVariable Long id) {
        return service.findById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
