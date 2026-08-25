package de.szut.gaestebuch.repository;

import java.time.LocalDateTime;

import de.szut.gaestebuch.model.GuestbookEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Datenzugriffsschicht fuer Gaestebucheintraege.
 */
public interface GuestbookEntryRepository extends JpaRepository<GuestbookEntry, Long> {

    /**
     * Abgeleitete Abfrage: Spring Data liest den Methodennamen und baut daraus
     * das passende SQL. "findBy" + "Date" + "GreaterThanEqual" + "And" +
     * "Date" + "LessThan" wird zu
     *
     *   ... where date >= ? and date < ?
     *
     * Es gibt keine Implementierung - der Name IST die Abfrage.
     *
     * Bewusst NICHT "Between": das waere beidseitig einschliessend
     * (date >= ? and date <= ?). Ein Eintrag exakt am 1. Januar des
     * Folgejahres um 00:00 Uhr wuerde dann in beide Jahre fallen.
     */
    Page<GuestbookEntry> findByDateGreaterThanEqualAndDateLessThan(
            LocalDateTime from, LocalDateTime to, Pageable pageable);
}
