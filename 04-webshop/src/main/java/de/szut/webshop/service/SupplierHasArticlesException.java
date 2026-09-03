package de.szut.webshop.service;

/**
 * Der Lieferant hat noch Artikel im Sortiment und darf deshalb nicht
 * geloescht werden.
 *
 * Das ist eine fachliche Regel, keine technische: Die Datenbank wuerde das
 * Loeschen ebenfalls verweigern - aber mit einer Meldung, die niemandem hilft.
 */
public class SupplierHasArticlesException extends RuntimeException {

    public SupplierHasArticlesException(Long id, long articleCount) {
        super("Lieferant " + id + " hat noch " + articleCount
                + " Artikel im Sortiment und kann nicht gelöscht werden.");
    }
}
