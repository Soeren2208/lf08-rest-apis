package de.szut.webshop;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * Ein Integrationstest: alle Schichten zusammen, gegen die echte Datenbank.
 *
 * Nichts ist hier ein Doppel. Die Anfrage laeuft durch Controller, Service,
 * Mapper, Repository bis in die PostgreSQL im Container und wieder zurueck.
 * Genau deshalb faengt dieser Test Fehler, die kein Slice-Test sehen kann:
 * eine falsche Spaltenlaenge, eine fehlende Kaskade, ein Mapper, der ein
 * Feld vergisst.
 *
 * Der Preis: Der Container muss laufen, und der Test ist um ein Vielfaches
 * langsamer als ein Unittest.
 *
 * @Transactional macht jeden Test danach rueckgaengig - sonst wuechse die
 * Datenbank mit jedem Testlauf.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Der Weg durch alle Schichten")
class SupplierIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String SUPPLIER_JSON = """
            {
              "name": "Nordwolle GmbH",
              "contact": {
                "street": "Am Deich 12",
                "postcode": "28199",
                "city": "Bremen",
                "phone": "0421 123456"
              }
            }
            """;

    @Test
    @DisplayName("Anlegen, lesen, Artikel haengen, loeschen scheitert")
    void completeRoundTrip() throws Exception {
        // 1. Anlegen - die Antwort traegt die vergebene Kennung
        MvcResult created = mockMvc.perform(post("/api/v1/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(SUPPLIER_JSON))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Nordwolle GmbH"))
                .andExpect(jsonPath("$.contact.city").value("Bremen"))
                .andExpect(jsonPath("$.articleCount").value(0))
                .andReturn();

        String location = created.getResponse().getHeader("Location");

        // 2. Unter der Adresse aus dem Location-Kopf ist er auch zu finden
        mockMvc.perform(get(location))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nordwolle GmbH"));

        // 3. Ein Artikel dazu
        mockMvc.perform(post(location + "/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"designation": "Wollpullover", "price": 89.90}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.supplierName").value("Nordwolle GmbH"));

        // 4. Jetzt zaehlt der Lieferant einen Artikel
        mockMvc.perform(get(location))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.articleCount").value(1));

        // 5. Und laesst sich deshalb nicht mehr loeschen
        mockMvc.perform(delete(location))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Löschen nicht möglich"));
    }

    @Test
    @DisplayName("Ein leerer Name kommt gar nicht erst bis zur Datenbank")
    void rejectsInvalidSupplier() throws Exception {
        mockMvc.perform(post("/api/v1/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name": "", "contact": {"street": "Am Deich 12",
                                 "postcode": "28199", "city": "Bremen"}}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists());
    }
}
