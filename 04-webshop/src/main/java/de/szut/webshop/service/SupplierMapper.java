package de.szut.webshop.service;

import org.springframework.stereotype.Component;

import de.szut.webshop.dto.ContactDto;
import de.szut.webshop.dto.CreateContactDto;
import de.szut.webshop.dto.CreateSupplierDto;
import de.szut.webshop.dto.SupplierDto;
import de.szut.webshop.model.Contact;
import de.szut.webshop.model.Supplier;

/**
 * Uebersetzt zwischen Entitaet und DTO - in beide Richtungen.
 *
 * Die Klasse weiss nichts von HTTP und nichts von der Datenbank. Genau
 * deshalb laesst sie sich ohne Spring und ohne Datenbank testen.
 */
@Component
public class SupplierMapper {

    /** Entitaet -> Antwort. articleCount kommt von aussen, gezaehlt statt geladen. */
    public SupplierDto toDto(Supplier supplier, long articleCount) {
        return new SupplierDto(
                supplier.getId(),
                supplier.getName(),
                toDto(supplier.getContact()),
                articleCount);
    }

    public ContactDto toDto(Contact contact) {
        if (contact == null) {
            return null;
        }
        return new ContactDto(
                contact.getStreet(),
                contact.getPostcode(),
                contact.getCity(),
                contact.getPhone());
    }

    /** Anfrage -> Entitaet. Ohne id: die vergibt die Datenbank. */
    public Supplier toEntity(CreateSupplierDto dto) {
        Supplier supplier = new Supplier();
        supplier.setName(dto.name());
        supplier.setContact(toEntity(dto.contact()));
        return supplier;
    }

    public Contact toEntity(CreateContactDto dto) {
        Contact contact = new Contact();
        contact.setStreet(dto.street());
        contact.setPostcode(dto.postcode());
        contact.setCity(dto.city());
        contact.setPhone(dto.phone());
        return contact;
    }
}
