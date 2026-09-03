package de.szut.gaestebuch.controller;

import java.net.URI;

import de.szut.gaestebuch.model.GuestbookEntry;
import de.szut.gaestebuch.service.GuestbookEntryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST-Controller fuer Gaestebucheintraege.
 *
 * Seit Tutorial 3 steht hier keine Fachlichkeit mehr: Der Controller nimmt
 * die Anfrage entgegen, reicht sie an den Service weiter und verpackt das
 * Ergebnis in eine HTTP-Antwort. Mehr nicht.
 *
 * Genau deshalb laesst er sich mit @WebMvcTest allein pruefen - ohne
 * Datenbank, mit einem Doppel fuer den Service.
 */
@RestController
@RequestMapping("/api/v1/guestbook-entries")
public class GuestbookEntryController {

    private final GuestbookEntryService service;

    public GuestbookEntryController(GuestbookEntryService service) {
        this.service = service;
    }

    /** Legt einen Eintrag an. Antwort: 201 Created samt Location-Kopfzeile. */
    @Operation(summary = "Legt einen neuen Gaestebucheintrag an")
    @ApiResponse(responseCode = "201", description = "Eintrag wurde angelegt")
    @ApiResponse(responseCode = "400", description = "Der Eintrag war ungueltig")
    @PostMapping
    public ResponseEntity<GuestbookEntry> createEntry(@RequestBody GuestbookEntry entry) {
        GuestbookEntry saved = service.create(entry);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saved.getId())
                .toUri();

        return ResponseEntity.created(location).body(saved);
    }

    /** Liefert eine Seite von Eintraegen, optional auf ein Jahr eingegrenzt. */
    @GetMapping
    public ResponseEntity<Page<GuestbookEntry>> findAllEntries(
            @RequestParam(required = false) Integer year,
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC)
            @ParameterObject Pageable pageable) {

        return ResponseEntity.ok(service.findAll(year, pageable));
    }

    /** Liefert einen Eintrag anhand seiner Id. Antwort: 200 OK oder 404 Not Found. */
    @GetMapping("/{id}")
    public ResponseEntity<GuestbookEntry> findEntryById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /** Aendert Titel, Kommentar und Verfasser eines Eintrags. Das Datum bleibt. */
    @PutMapping("/{id}")
    public ResponseEntity<GuestbookEntry> updateEntry(@PathVariable Long id,
                                                      @RequestBody GuestbookEntry entry) {
        return ResponseEntity.ok(service.update(id, entry));
    }

    /** Loescht einen Eintrag. Antwort: 204 No Content oder 404 Not Found. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntryById(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
