package de.szut.personenverwaltung.controller;

import java.util.List;

import de.szut.personenverwaltung.model.Person;
import de.szut.personenverwaltung.repository.PersonRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST-Controller fuer Personen.
 *
 * Alle Endpunkte sind unter /api/v1/persons erreichbar.
 */
@RestController
@RequestMapping("/api/v1/persons")
public class PersonController {

    private final PersonRepository repository;

    /**
     * Konstruktor-Injektion: Spring erkennt, dass diese Klasse ein
     * PersonRepository braucht, und uebergibt beim Erzeugen automatisch
     * eine Instanz. Bei genau einem Konstruktor ist keine Annotation noetig.
     */
    public PersonController(PersonRepository repository) {
        this.repository = repository;
    }

    /** Legt eine neue Person an. Antwort: 201 Created. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Person createPerson(@RequestBody Person person) {
        return repository.save(person);
    }

    /** Liefert alle Personen. Antwort: 200 OK. */
    @GetMapping
    public List<Person> getAllPersons() {
        return repository.findAll();
    }

    /** Liefert eine Person anhand ihrer Id. Antwort: 200 OK oder 404 Not Found. */
    @GetMapping("/{id}")
    public Person getPersonById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Keine Person mit der Id " + id));
    }

    /** Aendert eine vorhandene Person. Antwort: 200 OK oder 404 Not Found. */
    @PutMapping("/{id}")
    public Person updatePerson(@PathVariable Long id, @RequestBody Person person) {
        Person existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Keine Person mit der Id " + id));

        existing.setFirstname(person.getFirstname());
        existing.setSurname(person.getSurname());

        return repository.save(existing);
    }

    /** Loescht eine Person. Antwort: 204 No Content oder 404 Not Found. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePersonById(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Keine Person mit der Id " + id);
        }
        repository.deleteById(id);
    }
}
