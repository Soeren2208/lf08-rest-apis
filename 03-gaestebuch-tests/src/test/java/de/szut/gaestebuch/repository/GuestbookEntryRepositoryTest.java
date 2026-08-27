package de.szut.gaestebuch.repository;

import java.time.LocalDateTime;

import de.szut.gaestebuch.model.GuestbookEntry;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Slice-Test der Datenzugriffsschicht.
 *
 * @DataJpaTest startet NUR den JPA-Teil: Entitaeten, Repositories, eine
 * Datenbank. Kein Controller, kein Web-Server.
 *
 * Zwei Dinge nimmt einem diese Annotation ab:
 *   - Sie schaltet auf eine eigene Datenbank im Hauptspeicher um. Die Datei
 *     unter data/ wird nicht angefasst.
 *   - Sie macht jeden Test danach rueckgaengig. Jeder Test faengt bei null an.
 */
@DataJpaTest
@DisplayName("GuestbookEntryRepository (Datenbank-Schicht)")
class GuestbookEntryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private GuestbookEntryRepository repository;

    /** Legt einen Eintrag mit einem AUSDRUECKLICHEN Datum an. */
    private GuestbookEntry entryDated(LocalDateTime moment, String title) {
        GuestbookEntry entry = new GuestbookEntry();
        entry.setTitle(title);
        entry.setComment("Kommentar zu " + title);
        entry.setAuthor("Anna");
        entry.setDate(moment);
        return entityManager.persistAndFlush(entry);
    }

    @Test
    @DisplayName("faengt mit einer leeren Datenbank an")
    void startsEmpty() {
        assertThat(repository.count()).isZero();
    }

    @Test
    @DisplayName("das gesetzte Datum bleibt erhalten")
    void givenDateIsKept() {
        LocalDateTime moment = LocalDateTime.of(2020, 5, 17, 12, 0);

        GuestbookEntry saved = entryDated(moment, "Alt");
        entityManager.clear();

        GuestbookEntry loaded = repository.findById(saved.getId()).orElseThrow();
        assertThat(loaded.getDate()).isEqualTo(moment);
    }

    @Test
    @DisplayName("ohne Datum wird der aktuelle Zeitpunkt gesetzt")
    void withoutDateTheCurrentMomentIsSet() {
        GuestbookEntry entry = new GuestbookEntry();
        entry.setTitle("Neu");
        entry.setComment("Neu");
        entry.setAuthor("Anna");

        GuestbookEntry saved = entityManager.persistAndFlush(entry);

        assertThat(saved.getDate()).isNotNull();
        assertThat(saved.getDate()).isAfter(LocalDateTime.now().minusMinutes(1));
    }

    @Test
    @DisplayName("der Jahresfilter liefert nur Eintraege des gesuchten Jahres")
    void yearFilterReturnsOnlyThatYear() {
        entryDated(LocalDateTime.of(2025, 6, 1, 12, 0), "aus 2025");
        entryDated(LocalDateTime.of(2026, 6, 1, 12, 0), "aus 2026");
        entryDated(LocalDateTime.of(2027, 6, 1, 12, 0), "aus 2027");

        Page<GuestbookEntry> hits = repository.findByDateGreaterThanEqualAndDateLessThan(
                LocalDateTime.of(2026, 1, 1, 0, 0),
                LocalDateTime.of(2027, 1, 1, 0, 0),
                PageRequest.of(0, 10));

        assertThat(hits.getTotalElements()).isEqualTo(1);
        assertThat(hits.getContent().get(0).getTitle()).isEqualTo("aus 2026");
    }

    /**
     * Der eigentliche Grund fuer diese Testklasse.
     *
     * In Arbeitsblatt 03 des zweiten Tutorials stand die Behauptung, dass
     * "Between" hier falsch waere, weil es beide Grenzen einschliesst.
     * Dieser Test macht aus der Behauptung einen Beweis.
     */
    @Test
    @DisplayName("ein Eintrag exakt um Mitternacht am 1. Januar gehoert genau EINEM Jahr")
    void midnightBelongsToExactlyOneYear() {
        LocalDateTime turnOfYear = LocalDateTime.of(2027, 1, 1, 0, 0, 0);
        entryDated(turnOfYear, "Punkt Mitternacht");

        Page<GuestbookEntry> in2026 = repository.findByDateGreaterThanEqualAndDateLessThan(
                LocalDateTime.of(2026, 1, 1, 0, 0),
                LocalDateTime.of(2027, 1, 1, 0, 0),
                PageRequest.of(0, 10));

        Page<GuestbookEntry> in2027 = repository.findByDateGreaterThanEqualAndDateLessThan(
                LocalDateTime.of(2027, 1, 1, 0, 0),
                LocalDateTime.of(2028, 1, 1, 0, 0),
                PageRequest.of(0, 10));

        assertThat(in2026.getTotalElements()).isZero();
        assertThat(in2027.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("die letzte Sekunde des Jahres gehoert noch zum alten Jahr")
    void lastSecondBelongsToOldYear() {
        entryDated(LocalDateTime.of(2026, 12, 31, 23, 59, 59), "Silvester");

        Page<GuestbookEntry> in2026 = repository.findByDateGreaterThanEqualAndDateLessThan(
                LocalDateTime.of(2026, 1, 1, 0, 0),
                LocalDateTime.of(2027, 1, 1, 0, 0),
                PageRequest.of(0, 10));

        assertThat(in2026.getTotalElements()).isEqualTo(1);
    }
}
