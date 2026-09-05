package de.szut.webshop.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import de.szut.webshop.dto.ContactDto;
import de.szut.webshop.dto.SupplierDto;
import de.szut.webshop.service.SupplierHasArticlesException;
import de.szut.webshop.service.SupplierNotFoundException;
import de.szut.webshop.service.SupplierService;

/**
 * Die Web-Schicht allein. Kein Server, keine Datenbank - der Service ist
 * ein Doppel.
 *
 * @WebMvcTest laedt neben dem Controller auch den ApiExceptionHandler:
 * Aus einer fachlichen Ausnahme wird deshalb eine 404, keine 500.
 */
@WebMvcTest(SupplierController.class)
@DisplayName("SupplierController (Web-Schicht)")
class SupplierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SupplierService service;

    private SupplierDto sampleDto() {
        return new SupplierDto(1L, "Testlauf GmbH",
                new ContactDto("Hafenstr. 12", "28217", "Bremen", "0421 123456"), 0);
    }

    @Test
    @DisplayName("POST liefert 201 und eine Location-Kopfzeile")
    void postReturns201WithLocation() throws Exception {
        when(service.create(any())).thenReturn(sampleDto());

        mockMvc.perform(post("/api/v1/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Testlauf GmbH",
                                  "contact": {
                                    "street": "Hafenstr. 12",
                                    "postcode": "28217",
                                    "city": "Bremen"
                                  }
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location",
                        "http://localhost/api/v1/suppliers/1"))
                .andExpect(jsonPath("$.name").value("Testlauf GmbH"))
                .andExpect(jsonPath("$.contact.city").value("Bremen"));
    }

    @Test
    @DisplayName("POST ohne Namen liefert 400 und benennt das Feld")
    void postWithoutNameReturns400() throws Exception {
        mockMvc.perform(post("/api/v1/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "  ",
                                  "contact": {
                                    "street": "Hafenstr. 12",
                                    "postcode": "28217",
                                    "city": "Bremen"
                                  }
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists());
    }

    @Test
    @DisplayName("GET auf eine unbekannte Kennung liefert 404")
    void getUnknownReturns404() throws Exception {
        when(service.findById(42L)).thenThrow(new SupplierNotFoundException(42L));

        mockMvc.perform(get("/api/v1/suppliers/42"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Nicht gefunden"));
    }

    @Test
    @DisplayName("DELETE eines Lieferanten mit Artikeln liefert 409")
    void deleteWithArticlesReturns409() throws Exception {
        doThrow(new SupplierHasArticlesException(1L, 3))
                .when(service).deleteById(1L);

        mockMvc.perform(delete("/api/v1/suppliers/1"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.detail").value(
                        org.hamcrest.Matchers.containsString("3 Artikel")));
    }

    @Test
    @DisplayName("DELETE ohne Artikel liefert 204 ohne Rumpf")
    void deleteReturns204() throws Exception {
        mockMvc.perform(delete("/api/v1/suppliers/1"))
                .andExpect(status().isNoContent());
    }
}
