package de.szut.webshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import de.szut.webshop.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
