package de.szut.gaestebuch.controller;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;

import de.szut.gaestebuch.model.GuestbookEntry;
import de.szut.gaestebuch.repository.GuestbookEntryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST-Controller fuer Gaestebucheintraege.
 *
 * Anders als im ersten Tutorial geben die Methoden nicht mehr das Objekt
 * direkt zurueck, sondern ein ResponseEntity: eine Huelle aus Statuscode,
 * Kopfzeilen und Rumpf.
 */
@RestController
@RequestMapping("/api/v1/guestbook")
public class GuestbookEntryController {

    private final GuestbookEntryRepository repository;

    public GuestbookEntryController(GuestbookEntryRepository repository) {
        this.repository = repository;
    }

    /**
     * Legt einen Eintrag an.
     * Antwort: 201 Created samt Location-Kopfzeile mit der Adresse des neuen Eintrags.
     */
    @Operation(summary = "Legt einen neuen Gaestebucheintrag an")
    @ApiResponse(responseCode = "201", description = "Eintrag wurde angelegt")
    @ApiResponse(responseCode = "400", description = "Der Rumpf war fehlerhaft")
    @PostMapping
    public ResponseEntity<GuestbookEntry> createEntry(@RequestBody GuestbookEntry entry) {
        GuestbookEntry saved = repository.save(entry);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();

        return ResponseEntity.created(location).body(saved);
    }

    /**
     * Liefert eine Seite von Eintraegen, standardmaessig die neuesten zuerst.
     * Mit dem optionalen Parameter year wird auf ein Jahr eingegrenzt.
     */
    @GetMapping
    public ResponseEntity<Page<GuestbookEntry>> findAllEntries(
            @RequestParam(required = false) Integer year,
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC)
            Pageable pageable) {

        if (year == null) {
            return ResponseEntity.ok(repository.findAll(pageable));
        }

        LocalDateTime from = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime to = from.plusYears(1);

        return ResponseEntity.ok(
                repository.findByDateGreaterThanEqualAndDateLessThan(from, to, pageable));
    }

    /** Liefert einen Eintrag anhand seiner Id. Antwort: 200 OK oder 404 Not Found. */
    @GetMapping("/{id}")
    public ResponseEntity<GuestbookEntry> findEntryById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Kein Gaestebucheintrag mit der Id " + id));
    }

    /** Aendert Titel, Kommentar und Verfasser eines Eintrags. Das Datum bleibt. */
    @PutMapping("/{id}")
    public ResponseEntity<GuestbookEntry> updateEntry(@PathVariable Long id,
                                                      @RequestBody GuestbookEntry entry) {
        GuestbookEntry existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Kein Gaestebucheintrag mit der Id " + id));

        existing.setTitle(entry.getTitle());
        existing.setComment(entry.getComment());
        existing.setAuthor(entry.getAuthor());

        return ResponseEntity.ok(repository.save(existing));
    }

    /** Loescht einen Eintrag. Antwort: 204 No Content oder 404 Not Found. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntryById(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Kein Gaestebucheintrag mit der Id " + id);
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
