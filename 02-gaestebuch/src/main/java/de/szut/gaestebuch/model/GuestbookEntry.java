package de.szut.gaestebuch.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Ein Eintrag im Gaestebuch.
 *
 * Die Lombok-Annotation @Data erzeugt beim Kompilieren Getter, Setter,
 * toString(), equals() und hashCode() - sowie einen Konstruktor mit allen
 * final-Feldern (@RequiredArgsConstructor), NICHT den parameterlosen.
 *
 * Den braucht Hibernate aber, um Objekte aus der Datenbank zu erzeugen.
 * Deshalb steht @NoArgsConstructor ausdruecklich daneben.
 */
@Entity
@Table(name = "guestbook_entry")
@Data
@NoArgsConstructor
public class GuestbookEntry {

    /**
     * IDENTITY laesst die Datenbank pro Tabelle hochzaehlen: 1, 2, 3 ...
     * Im ersten Tutorial stand hier AUTO - dort vergibt eine Sequenz die
     * Werte in Bloecken, weshalb die Ids nach einem Neustart springen koennen.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    /** Der eigentliche Kommentar - laenger als die Standardbreite von 255. */
    @Column(length = 2000)
    private String comment;

    private String author;

    /**
     * Das Anlegedatum setzt Hibernate automatisch beim ersten Speichern.
     * updatable = false verhindert, dass es spaeter veraendert wird -
     * ein Eintrag wurde nun einmal zu einem bestimmten Zeitpunkt verfasst.
     *
     * name = "date_of_entry" benennt die Spalte um. Ohne die Angabe hiesse
     * sie wie das Attribut, also "date" - und DATE ist in der SQL-Norm ein
     * reserviertes Wort. H2 kommt damit zurecht, andere Datenbanken nicht.
     */
    @CreationTimestamp
    @Column(name = "date_of_entry", nullable = false, updatable = false)
    private LocalDateTime date;
}
