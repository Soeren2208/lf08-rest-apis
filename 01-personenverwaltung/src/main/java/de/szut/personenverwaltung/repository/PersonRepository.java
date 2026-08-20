package de.szut.personenverwaltung.repository;

import de.szut.personenverwaltung.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Datenzugriffsschicht fuer Personen.
 *
 * Dieses Interface wird NICHT implementiert - Spring Data erzeugt zur
 * Laufzeit eine Implementierung mit allen CRUD-Methoden (save, findById,
 * findAll, deleteById ...).
 *
 * Die beiden Typparameter bedeuten:
 *   Person - der Entitaetstyp, der verwaltet wird
 *   Long   - der Datentyp des Primaerschluessels
 */
public interface PersonRepository extends JpaRepository<Person, Long> {
}
