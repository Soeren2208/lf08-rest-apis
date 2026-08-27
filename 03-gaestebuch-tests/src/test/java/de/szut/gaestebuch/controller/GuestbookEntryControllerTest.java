package de.szut.gaestebuch.controller;

import java.time.LocalDateTime;

import de.szut.gaestebuch.model.GuestbookEntry;
import de.szut.gaestebuch.service.EntryNotFoundException;
import de.szut.gaestebuch.service.GuestbookEntryService;
import de.szut.gaestebuch.service.InvalidEntryException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Slice-Test der Web-Schicht.
 *
 * @WebMvcTest startet NUR den Web-Teil von Spring: Controller, Umwandlung
 * von und nach JSON, Statuscodes, den ApiExceptionHandler. Kein Repository,
 * keine Datenbank, kein Tomcat.
 *
 * Den Service ersetzt @MockitoBean durch ein Doppel. Was dieser Test prueft,
 * ist also ausschliesslich die Uebersetzung zwischen HTTP und Java - nicht
 * die Fachlichkeit (die hat GuestbookEntryServiceTest geprueft).
 */
@WebMvcTest(GuestbookEntryController.class)
@DisplayName("GuestbookEntryController (Web-Schicht)")
class GuestbookEntryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /** Das Doppel fuer den Service - der echte wird nicht geladen. */
    @MockitoBean
    private GuestbookEntryService service;

    private GuestbookEntry sampleEntry() {
        GuestbookEntry entry = new GuestbookEntry();
        entry.setId(1L);
        entry.setTitle("Toller Kurs");
        entry.setComment("Hat mir gut gefallen!");
        entry.setAuthor("Anna");
        entry.setDate(LocalDateTime.of(2026, 3, 1, 10, 0));
        return entry;
    }

    @Test
    @DisplayName("POST liefert 201 und eine Location-Kopfzeile")
    void postReturns201WithLocation() throws Exception {
        GuestbookEntry saved = sampleEntry();
        when(service.create(any(GuestbookEntry.class))).thenReturn(saved);

        mockMvc.perform(post("/api/v1/guestbook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Toller Kurs",
                                  "comment": "Hat mir gut gefallen!",
                                  "author": "Anna"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location",
                        "http://localhost/api/v1/guestbook/1"))
                .andExpect(jsonPath("$.title").value("Toller Kurs"))
                .andExpect(jsonPath("$.author").value("Anna"));
    }

    @Test
    @DisplayName("POST liefert 400, wenn der Service den Eintrag ablehnt")
    void postReturns400ForInvalidEntry() throws Exception {
        when(service.create(any(GuestbookEntry.class)))
                .thenThrow(new InvalidEntryException("Der Titel darf nicht leer sein."));

        mockMvc.perform(post("/api/v1/guestbook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"comment\":\"ohne Titel\",\"author\":\"Anna\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("Der Titel darf nicht leer sein."));
    }

    @Test
    @DisplayName("GET auf eine unbekannte Id liefert 404 mit Begruendung")
    void getReturns404ForUnknownId() throws Exception {
        when(service.findById(9999L)).thenThrow(new EntryNotFoundException(9999L));

        mockMvc.perform(get("/api/v1/guestbook/9999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value(
                        "Kein Gaestebucheintrag mit der Id 9999"));
    }

    @Test
    @DisplayName("GET auf die Sammlung liefert eine Seite")
    void getReturnsPage() throws Exception {
        Page<GuestbookEntry> page =
                new PageImpl<>(java.util.List.of(sampleEntry()));
        when(service.findAll(eq(null), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/v1/guestbook"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Toller Kurs"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("DELETE liefert 204 ohne Rumpf")
    void deleteReturns204() throws Exception {
        mockMvc.perform(delete("/api/v1/guestbook/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE auf eine unbekannte Id liefert 404")
    void deleteReturns404() throws Exception {
        doThrow(new EntryNotFoundException(9999L)).when(service).deleteById(9999L);

        mockMvc.perform(delete("/api/v1/guestbook/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("fehlerhaftes JSON liefert 400 - dafuer sorgt Spring selbst")
    void brokenJsonReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/guestbook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": "))
                .andExpect(status().isBadRequest());
    }
}
