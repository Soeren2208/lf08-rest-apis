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
     * das passende SQL. "findBy" + "Date" + "Between" wird zu
     *
     *   ... where date between ? and ?
     *
     * Es gibt keine Implementierung - der Name IST die Abfrage.
     */
    Page<GuestbookEntry> findByDateBetween(LocalDateTime from, LocalDateTime to, Pageable pageable);
}
