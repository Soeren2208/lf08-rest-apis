package de.szut.webshop.service;

/** Es gibt keinen Lieferanten mit dieser Kennung. */
public class SupplierNotFoundException extends RuntimeException {

    public SupplierNotFoundException(Long id) {
        super("Es gibt keinen Lieferanten mit der Kennung " + id + ".");
    }
}
