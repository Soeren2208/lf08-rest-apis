package de.szut.gaestebuch.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import de.szut.gaestebuch.model.GuestbookEntry;
import de.szut.gaestebuch.repository.GuestbookEntryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Die fachliche Schicht des Gaestebuchs.
 *
 * Hier stehen die Regeln: Was ist ein gueltiger Eintrag? Was passiert beim
 * Aendern? Der Controller kennt nur HTTP, das Repository nur die Datenbank -
 * dazwischen fehlte bisher der Ort fuer die Fachlichkeit.
 *
 * Diese Klasse kennt weder Statuscodes noch Kopfzeilen. Sie wirft eigene
 * Ausnahmen; welche Antwort daraus wird, entscheidet die Web-Schicht.
 */
@Service
public class GuestbookEntryService {

    public static final int MAX_TITLE_LENGTH = 80;
    public static final int MAX_COMMENT_LENGTH = 2000;
    public static final int MAX_AUTHOR_LENGTH = 50;

    private final GuestbookEntryRepository repository;

    public GuestbookEntryService(GuestbookEntryRepository repository) {
        this.repository = repository;
    }

    /** Prueft den Eintrag und speichert ihn. */
    public GuestbookEntry create(GuestbookEntry entry) {
        validate(entry);
        return repository.save(entry);
    }

    /** Liefert eine Seite von Eintraegen, optional auf ein Jahr eingegrenzt. */
    public Page<GuestbookEntry> findAll(Integer year, Pageable pageable) {
        if (year == null) {
            return repository.findAll(pageable);
        }
        LocalDateTime from = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime to = from.plusYears(1);
        return repository.findByDateGreaterThanEqualAndDateLessThan(from, to, pageable);
    }

    /** Liefert einen Eintrag oder wirft EntryNotFoundException. */
    public GuestbookEntry findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntryNotFoundException(id));
    }

    /** Aendert Titel, Kommentar und Verfasser. Das Datum bleibt unberuehrt. */
    public GuestbookEntry update(Long id, GuestbookEntry entry) {
        validate(entry);

        GuestbookEntry existing = findById(id);
        existing.setTitle(entry.getTitle());
        existing.setComment(entry.getComment());
        existing.setAuthor(entry.getAuthor());

        return repository.save(existing);
    }

    /**
     * Loescht einen Eintrag oder wirft EntryNotFoundException.
     *
     * findById wirft bereits, wenn es die Id nicht gibt - deshalb genuegt
     * hier eine Zeile.
     */
    public void deleteById(Long id) {
        repository.delete(findById(id));
    }

    /**
     * Die fachlichen Regeln fuer einen Eintrag.
     *
     * Paketsichtbar statt privat, damit der Unit-Test sie direkt aufrufen
     * kann - der Test liegt im selben Paket.
     */
    void validate(GuestbookEntry entry) {
        checkText(entry.getTitle(), "Der Titel", MAX_TITLE_LENGTH);
        checkText(entry.getComment(), "Der Kommentar", MAX_COMMENT_LENGTH);
        checkText(entry.getAuthor(), "Der Verfasser", MAX_AUTHOR_LENGTH);
    }

    private void checkText(String value, String label, int maxLength) {
        if (value == null || value.isBlank()) {
            throw new InvalidEntryException(label + " darf nicht leer sein.");
        }
        if (value.length() > maxLength) {
            throw new InvalidEntryException(
                    label + " darf hoechstens " + maxLength + " Zeichen lang sein.");
        }
    }
}
