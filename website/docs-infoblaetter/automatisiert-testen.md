---
title: Automatisiert testen
sidebar_label: Automatisiert testen
sidebar_position: 14
---

# Automatisiert testen

## Der Unterschied zum Testfall

Im Infoblatt [Testfälle formulieren](/infoblaetter/testfaelle) geht es darum, **was** geprüft wird: Ausgangslage, Eingabe, erwartetes Ergebnis. Hier geht es darum, das Ganze so aufzuschreiben, dass es **von selbst läuft** — bei jedem Speichern, bei jedem Bauen, bei jedem Zusammenführen.

Der Gewinn ist nicht, dass man einmal weniger klickt. Der Gewinn ist, dass man **beim hundertsten Mal** noch prüft.

| Von Hand | Automatisch |
|---|---|
| dauert bei jedem Durchlauf gleich lang | einmal schreiben, dann Sekunden |
| wird bei Zeitdruck übersprungen | läuft, ob man will oder nicht |
| prüft, woran man gerade denkt | prüft auch die alte Ecke von vor drei Monaten |
| das Ergebnis steht im Kopf | das Ergebnis steht in der Ausgabe |

Der eigentliche Zweck ist der letzte Punkt in anderer Form: Ein Test schützt nicht den Code, den du gerade schreibst. Er schützt den Code, den du **in einem halben Jahr änderst**.

## Drei Ebenen — und was daran echt ist

Nicht jeder Test prüft dasselbe. Der Unterschied zwischen den drei Arten ist genau **eine** Frage: *Wie viel von der Anwendung läuft wirklich mit?*

<svg viewBox="0 0 720 420" width="100%" role="img"
     aria-label="Die drei Testebenen als Pyramide: Unten viele schnelle Unittests ohne Spring, in der Mitte Slice-Tests mit einem Teil des Spring-Kontexts, oben wenige langsame Integrationstests mit der ganzen Anwendung und echter Datenbank."
     fontFamily="var(--ifm-font-family-base)">

  {/* Spitze: Integration */}
  <path d="M 360 16 L 470 106 L 250 106 z"
        fill="var(--ifm-color-danger-contrast-background)"/>
  <path d="M 360 16 L 470 106 L 250 106 z" fill="none"
        stroke="var(--ifm-color-danger-dark)" strokeWidth="1.8"/>
  <text x="360" y="72" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="var(--zeichnung-rot)">Integration</text>
  <text x="360" y="92" textAnchor="middle" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">wenige</text>

  {/* Mitte: Slice */}
  <path d="M 246 112 L 474 112 L 546 216 L 174 216 z"
        fill="var(--ifm-color-warning-contrast-background)"/>
  <path d="M 246 112 L 474 112 L 546 216 L 174 216 z" fill="none"
        stroke="var(--ifm-color-warning-dark)" strokeWidth="1.8"/>
  <text x="360" y="158" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Slice-Tests</text>
  <text x="360" y="180" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">eine Schicht mit ihrem Spring-Anteil</text>
  <text x="360" y="200" textAnchor="middle" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">einige</text>

  {/* Basis: Unit */}
  <path d="M 170 222 L 550 222 L 622 340 L 98 340 z"
        fill="var(--ifm-color-success-contrast-background)"/>
  <path d="M 170 222 L 550 222 L 622 340 L 98 340 z" fill="none"
        stroke="var(--ifm-color-success-dark)" strokeWidth="1.8"/>
  <text x="360" y="268" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Unittests</text>
  <text x="360" y="290" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">eine Klasse allein, ohne Spring</text>
  <text x="360" y="310" textAnchor="middle" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">viele</text>

  {/* linke Achse: Geschwindigkeit */}
  <path d="M 60 330 L 60 40" stroke="var(--zeichnung-akzent)" strokeWidth="2"
        markerEnd="url(#pfeil-test)"/>
  <defs>
    <marker id="pfeil-test" markerWidth="9" markerHeight="9" refX="8" refY="4.5"
            orient="auto">
      <path d="M 0 0 L 9 4.5 L 0 9 z" fill="var(--zeichnung-akzent)"/>
    </marker>
  </defs>
  <text x="52" y="188" textAnchor="middle" fontSize="11.5" fontWeight="700"
        fill="var(--zeichnung-akzent)" transform="rotate(-90 52 188)">langsamer, aufwendiger</text>

  {/* rechte Achse: Realitaetsnaehe */}
  <path d="M 664 330 L 664 40" stroke="var(--zeichnung-blau)" strokeWidth="2"
        markerEnd="url(#pfeil-test2)"/>
  <defs>
    <marker id="pfeil-test2" markerWidth="9" markerHeight="9" refX="8" refY="4.5"
            orient="auto">
      <path d="M 0 0 L 9 4.5 L 0 9 z" fill="var(--zeichnung-blau)"/>
    </marker>
  </defs>
  <text x="678" y="188" textAnchor="middle" fontSize="11.5" fontWeight="700"
        fill="var(--zeichnung-blau)" transform="rotate(-90 678 188)">näher an der Wirklichkeit</text>

  {/* Fussnote */}
  <text x="98" y="374" fontSize="12" fontWeight="700"
        fill="var(--ifm-font-color-base)">Die Breite ist die Empfehlung, wie viele Tests einer Art man schreibt.</text>
  <text x="98" y="396" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Ein Projekt, in dem die Pyramide auf dem Kopf steht, hat lange Testläufe und findet Fehler trotzdem spät.</text>
</svg>

## Ebene 1: Der Unittest

**Eine Klasse, allein, ohne Spring.** Kein Kontext, keine Datenbank, kein Server. Was die Klasse braucht, bekommt sie als **Doppel** in den Konstruktor.

```java
@DisplayName("SupplierService")
class SupplierServiceTest {

    private SupplierRepository supplierRepository;
    private ArticleRepository articleRepository;
    private SupplierService service;

    @BeforeEach
    void setUp() {
        supplierRepository = mock(SupplierRepository.class);
        articleRepository = mock(ArticleRepository.class);
        service = new SupplierService(supplierRepository, articleRepository, new SupplierMapper());
    }

    @Test
    @DisplayName("Ein Lieferant mit Artikeln wird nicht gelöscht")
    void refusesToDeleteSupplierWithArticles() {
        when(supplierRepository.findById(1L)).thenReturn(Optional.of(new Supplier()));
        when(articleRepository.countBySupplierId(1L)).thenReturn(3L);

        assertThatThrownBy(() -> service.deleteSupplier(1L))
                .isInstanceOf(SupplierHasArticlesException.class);

        verify(supplierRepository, never()).deleteById(anyLong());
    }
}
```

Drei Dinge, die diesen Test ausmachen:

- **`new SupplierService(...)`** — der Test ruft den Konstruktor selbst auf. Genau deshalb braucht die Klasse ihre Abhängigkeiten im Konstruktor und nicht per `@Autowired` auf einem Feld.
- **`mock(...)`** stellt ein Doppel her, das nichts kann, bis man ihm etwas beibringt: `when(...).thenReturn(...)`.
- **`verify(..., never())`** prüft, dass etwas **nicht** passiert ist. Ein Test, der nur das erwartete Ergebnis prüft, würde nicht merken, wenn nebenbei trotzdem gelöscht wird.

:::tip Wenn ein Unittest schwer zu schreiben ist, liegt es selten am Test
Braucht eine Klasse fünf Doppel, macht sie zu viel. Lässt sie sich nicht ohne Datenbank prüfen, hat die Regel den falschen Platz. Der Test ist hier weniger Prüfwerkzeug als **Rückmeldung über den Entwurf**.
:::

## Ebene 2: Der Slice-Test

Manches lässt sich ohne Spring nicht prüfen: Ob `/api/v1/suppliers/7` überhaupt beim Controller ankommt. Ob aus der Entität das richtige JSON wird. Ob die abgeleitete Abfrage das richtige SQL erzeugt.

Ein **Slice-Test** startet deshalb einen *Ausschnitt* des Spring-Kontexts — nur die Schicht, um die es geht.

### `@WebMvcTest` — die Web-Schicht

```java
@WebMvcTest(SupplierController.class)
@DisplayName("SupplierController (Web-Schicht)")
class SupplierControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SupplierService service;

    @Test
    @DisplayName("Unbekannte Kennung ergibt 404")
    void returnsNotFound() throws Exception {
        when(service.findSupplierById(99L))
                .thenThrow(new SupplierNotFoundException(99L));

        mockMvc.perform(get("/api/v1/suppliers/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Nicht gefunden"));
    }
}
```

| Läuft mit | Läuft **nicht** mit |
|---|---|
| der genannte Controller | Service-Klassen (die ersetzt `@MockitoBean`) |
| die JSON-Umwandlung | Repositories |
| `@RestControllerAdvice` | die Datenbank |
| Filter und Konverter | ein echter Web-Server |

`MockMvc` schickt die Anfrage direkt in Springs Web-Schicht — ohne Netzwerk, ohne Port. Deshalb ist ein solcher Test schnell genug, um Dutzende davon zu haben.

:::info `@WebMvcTest` lädt die Fehlerbehandlung von selbst mit
Ein `@RestControllerAdvice` gehört zur Web-Schicht und wird von `@WebMvcTest` automatisch geladen — ein zusätzliches `@Import(ApiExceptionHandler.class)` ist **nicht** nötig.

Das ist auch der Grund, warum sich Fehlerantworten hier so gut prüfen lassen: Statuscode und `ProblemDetail` entstehen genau in dieser Schicht.
:::

### `@DataJpaTest` — die Datenbank-Schicht

```java
@DataJpaTest
@DisplayName("GuestbookEntryRepository (Datenbank-Schicht)")
class GuestbookEntryRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private GuestbookEntryRepository repository;
}
```

`@DataJpaTest` nimmt einem zwei Dinge ab:

1. **Es schaltet auf eine Datenbank im Arbeitsspeicher um** (H2, falls im Projekt vorhanden). Die richtige Datenbank wird nicht angefasst.
2. **Es macht jeden Test danach rückgängig.** Jeder Test fängt bei null an, egal in welcher Reihenfolge sie laufen.

`TestEntityManager` ist die Testausgabe des `EntityManager`: Damit legt man die Ausgangslage an (`persist`) und leert den Zwischenspeicher (`flush`), damit der nächste Zugriff wirklich aus der Datenbank kommt.

:::warning Wenn gerade das Verhalten der echten Datenbank geprüft werden soll
H2 ist nicht PostgreSQL. Fremdschlüssel, Eindeutigkeitsregeln und Kaskaden verhalten sich ähnlich, aber nicht gleich. Wer genau das prüfen will, schaltet den Austausch ab:

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class SupplierRepositoryTest { … }
```

Dann läuft der Test gegen die PostgreSQL im Container — und der Container **muss laufen**. Genau so macht es das Webshop-Tutorial, weil dort das Datenbankverhalten der Gegenstand ist.
:::

## Ebene 3: Der Integrationstest

Hier ist **nichts** mehr ein Doppel. Die Anfrage läuft durch Controller, Service, Mapper und Repository bis in die echte Datenbank und zurück.

### Die Vorarbeiten

Ein Integrationstest hat mehr Voraussetzungen als die anderen beiden. Alle vier müssen erfüllt sein, sonst läuft er gar nicht erst:

| | Was gebraucht wird | Woran man merkt, dass es fehlt |
|---|---|---|
| **1. Abhängigkeit** | `spring-boot-starter-webmvc-test` mit `<scope>test</scope>` | `@SpringBootTest` lässt sich nicht auflösen |
| **2. Eine echte Datenbank** | Der Container läuft (`docker compose up -d`) | `Connection refused` beim Start des Kontexts |
| **3. Vollständige Konfiguration** | Die `application.properties` muss stimmen — sie gilt auch im Test | Der Kontext startet gar nicht |
| **4. Aufräumen** | `@Transactional` an der Testklasse | Die Datenbank wächst mit jedem Testlauf |

### Die Klasse

```java
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Der Weg durch alle Schichten")
class SupplierIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Anlegen, lesen, Artikel hängen, löschen scheitert")
    void completeRoundTrip() throws Exception {
        MvcResult created = mockMvc.perform(post("/api/v1/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(SUPPLIER_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.articleCount").value(0))
                .andReturn();

        String location = created.getResponse().getHeader("Location");

        mockMvc.perform(post(location + "/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"designation": "Wollpullover", "price": 89.90}
                                """))
                .andExpect(status().isCreated());

        mockMvc.perform(get(location))
                .andExpect(jsonPath("$.articleCount").value(1));

        mockMvc.perform(delete(location))
                .andExpect(status().isConflict());
    }
}
```

Drei Annotationen, drei Aufgaben:

| | |
|---|---|
| `@SpringBootTest` | startet den **ganzen** Anwendungskontext, so wie beim echten Start |
| `@AutoConfigureMockMvc` | legt `MockMvc` dazu — Anfragen ohne Netzwerk und ohne Port |
| `@Transactional` | rollt jeden Test danach zurück |

:::tip Warum der Test die Adresse aus dem `Location`-Kopf benutzt
Er könnte die Kennung aus dem JSON lesen und sich die Adresse zusammenbauen. Tut er aber nicht — er nimmt genau die Adresse, die der Server geliefert hat.

Damit prüft er nebenbei, dass dieser Kopf überhaupt stimmt. Und er bleibt heil, wenn sich das Adressschema einmal ändert.
:::

:::danger `@Transactional` im Test ist nicht dasselbe wie im Betrieb
Der Test läuft in **einer** Transaktion, die am Ende zurückgerollt wird. Im Betrieb hat jede Anfrage ihre eigene.

Das hat eine unangenehme Folge: Ein Fehler, der erst beim **Bestätigen** der Transaktion auftritt — eine verletzte Eindeutigkeit zum Beispiel — kann im Test unbemerkt bleiben. Für solche Fälle braucht es einen Test ohne `@Transactional`, der hinterher selbst aufräumt.
:::

## Die Abhängigkeiten

Seit Spring Boot 4 ist der frühere Sammel-Starter `spring-boot-starter-test` **aufgeteilt**. Man holt nur noch das, was man braucht:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa-test</artifactId>
    <scope>test</scope>
</dependency>
```

`<scope>test</scope>` heißt: Diese Bibliotheken landen **nicht** in der ausgelieferten Anwendung. Mehr dazu im Infoblatt [Maven und Abhängigkeiten](/infoblaetter/maven).

Mitgeliefert werden dabei unter anderem:

| Bibliothek | Wofür | Version in diesem Projekt |
|---|---|---|
| **JUnit Jupiter** | `@Test`, `@BeforeEach`, `@DisplayName` — die Testausführung | 6.0.3 |
| **AssertJ** | `assertThat(...)` — lesbare Zusicherungen | 3.27.7 |
| **Mockito** | `mock(...)`, `when(...)`, `verify(...)` — die Doppel | 5.23.0 |
| **JSONPath** | `jsonPath("$.name")` — in eine JSON-Antwort hineingreifen | 2.10.0 |

Die Versionen stehen nirgends in der `pom.xml`: Sie kommen über den Eltern-Eintrag `spring-boot-starter-parent`. Wer eine davon von Hand festlegt, riskiert genau die Versionskonflikte, die Boot einem abnimmt.

:::warning Die Importpfade haben sich mit Boot 4 geändert
Ältere Anleitungen im Netz nennen noch die alten Pakete. Die Klassen heißen gleich, liegen aber woanders — die Entwicklungsumgebung schlägt beim automatischen Import womöglich den falschen vor.

| Annotation | Paket ab Boot 4 |
|---|---|
| `@SpringBootTest` | `org.springframework.boot.test.context` |
| `@WebMvcTest` | `org.springframework.boot.webmvc.test.autoconfigure` |
| `@AutoConfigureMockMvc` | `org.springframework.boot.webmvc.test.autoconfigure` |
| `@DataJpaTest` | `org.springframework.boot.data.jpa.test.autoconfigure` |
| `TestEntityManager` | `org.springframework.boot.jpa.test.autoconfigure` |
| `@AutoConfigureTestDatabase` | `org.springframework.boot.jdbc.test.autoconfigure` |
| `@MockitoBean` | `org.springframework.test.context.bean.override.mockito` |

`@MockitoBean` ersetzt außerdem das frühere `@MockBean` — gleiche Aufgabe, neuer Name.
:::

## Was jede Ebene findet — und was nicht

| | findet | findet **nicht** |
|---|---|---|
| **Unittest** | falsche Rechnung, vergessener Sonderfall, falsche Bedingung | alles, was zwischen zwei Klassen passiert |
| **Slice-Test** | falsche Adresse, falscher Statuscode, falsches JSON, falsche Abfrage | ob die Schichten zusammenpassen |
| **Integrationstest** | vergessener Mapper-Eintrag, falsche Kaskade, zu kurze Spalte, falsche Reihenfolge | die Sonderfälle tief in einer Klasse — dafür ist er zu grob |

Das ist der Grund für die Pyramide: Jede Ebene findet etwas, das die anderen nicht sehen. Und jede Ebene ist teurer als die darunter.

## Was das kostet — gemessen

Aus dem Webshop-Projekt, JDK 26, Spring Boot 4.1.1, jede Testart einzeln gestartet:

| Testart | Tests | reine Testzeit |
|---|---|---|
| Unittests (Mapper, Service) | 6 | 0,5 s + 4,1 s |
| Slice-Tests (`@WebMvcTest`, `@DataJpaTest`) | 8 | 15,8 s + 16,4 s |
| Integrationstest (`@SpringBootTest`) | 2 | 34,9 s |

Zwei Anmerkungen zur Ehrlichkeit dieser Zahlen:

- Der größte Posten ist **nicht** der einzelne Test, sondern der **Start des Spring-Kontexts**. Er fällt einmal pro Kontext-Zuschnitt an — deshalb sind fünf `@WebMvcTest`-Methoden kaum teurer als eine.
- Die 4,1 Sekunden beim Service-Unittest sind fast vollständig die **erste Benutzung von Mockito**. Der zweite Unittest im selben Lauf kostet Millisekunden.

Die Größenordnung bleibt: Ein Unittest ist etwa **hundertmal** billiger als ein Integrationstest. Deshalb liegen unten viele und oben wenige.

## Doppel: Mock, Stub, `@MockitoBean`

„Doppel" ist der Oberbegriff für alles, was im Test an die Stelle des Echten tritt.

| Begriff | Was es tut |
|---|---|
| **Stub** | antwortet auf Anfragen mit vorbereiteten Werten — `when(...).thenReturn(...)` |
| **Mock** | merkt sich zusätzlich, **ob** und **wie oft** es gerufen wurde — `verify(...)` |
| **`mock(...)`** | erzeugt so ein Doppel im **Unittest**, per `new` in den Konstruktor |
| **`@MockitoBean`** | ersetzt eine **Bohne im Spring-Kontext** durch ein Doppel — nur im Slice-Test |

Die Faustregel: **`mock(...)` im Unittest, `@MockitoBean` im Slice-Test, im Integrationstest gar nichts.** Wer im Integrationstest anfängt, Doppel einzusetzen, hat den Zweck verloren — dann ist es ein sehr langsamer Slice-Test.

## Welchen Test schreibe ich wofür?

| Was du prüfen willst | Testart |
|---|---|
| Eine Berechnung, eine Bedingung, ein Sonderfall | Unittest |
| Eine fachliche Regel („nicht löschen, wenn …") | Unittest mit Doppeln |
| Ein Mapper | Unittest, ohne alles |
| Statuscode, Adresse, JSON-Form | `@WebMvcTest` |
| Eine Fehlerantwort | `@WebMvcTest` |
| Eine abgeleitete Abfrage, eine Sortierung, eine Seite | `@DataJpaTest` |
| Ein Fremdschlüssel, eine Kaskade, eine Eindeutigkeit | `@DataJpaTest` gegen die echte Datenbank |
| Dass alle Schichten zusammenpassen | Integrationstest |
| Dass die Anwendung überhaupt startet | `@SpringBootTest` mit einem leeren Test |

:::info Der billigste Test, den es gibt
```java
@SpringBootTest
class WebshopApplicationTests {

    @Test
    void contextLoads() {
    }
}
```
Der Test prüft **nichts** — und findet trotzdem eine Menge: jede fehlende Bohne, jede doppelte Konfiguration, jede kaputte `application.properties`. Diese Klasse legt Spring Initializr von sich aus an. Nicht löschen.
:::

## Häufige Fallen

| Falle | Was passiert | Was hilft |
|---|---|---|
| **Test hängt an der Reihenfolge** | Läuft allein grün, im Verbund rot | Jeder Test legt seine Ausgangslage selbst an. `@Transactional` oder `@BeforeEach` |
| **Die Testdatenbank wächst** | Nach zehn Läufen kommen falsche Anzahlen heraus | `@Transactional` an der Testklasse |
| **Alles ist ein Integrationstest** | Der Lauf dauert Minuten, niemand startet ihn mehr | Regeln nach unten in Unittests verschieben |
| **Der Test prüft die Umsetzung statt das Verhalten** | Jede Umbenennung macht Tests rot, ohne dass etwas kaputt ist | Prüfe, was herauskommt, nicht wie es zustande kam |
| **Ein Test ohne Zusicherung** | Bleibt für immer grün | Jeder Test braucht mindestens ein `assert…` oder `andExpect` |
| **Der Container läuft nicht** | Der Kontext startet nicht, hundert Zeilen Fehlermeldung | Erst `docker compose ps`, dann suchen |
| **Zufall oder Uhrzeit im Test** | Grün am Montag, rot am Sonntag | Feste Werte einsetzen |

:::warning Ein grüner Testlauf ist kein Beweis
Er sagt: „Was geprüft wird, stimmt." Er sagt **nicht**, dass genug geprüft wird.

Die ehrlichste Probe ist die Gegenrichtung: Bau absichtlich einen Fehler ein — dreh ein `>` in ein `>=`, lösch eine Zeile im Mapper. **Wird jetzt ein Test rot?** Wenn nicht, fehlt einer.
:::

## Prüfliste

- [ ] Jeder Test hat einen Namen, der sagt, **was** gilt — nicht `test1`
- [ ] `@DisplayName` beschreibt den Fall in einem Satz
- [ ] Jeder Test legt seine Ausgangslage selbst an
- [ ] Jeder Test hat mindestens eine Zusicherung
- [ ] Die Testarten sind getrennt: Regeln im Unittest, HTTP im Slice-Test
- [ ] Kein `@SpringBootTest`, wo ein Slice-Test reicht
- [ ] Fehlerfälle sind mitgeprüft, nicht nur der glückliche Weg
- [ ] Der Testlauf läuft ohne Vorbereitung durch — außer dem Container
- [ ] Ein absichtlich eingebauter Fehler macht mindestens einen Test rot

## Das Wichtigste in Kürze

- **Unittest:** eine Klasse, kein Spring, Doppel per `mock(...)`. Millisekunden.
- **Slice-Test:** eine Schicht mit ihrem Spring-Anteil — `@WebMvcTest` für Web, `@DataJpaTest` für Datenbank.
- **Integrationstest:** alles echt, `@SpringBootTest` + `@AutoConfigureMockMvc` + `@Transactional`. Braucht die laufende Datenbank.
- Die **Startzeit des Kontexts** ist der Hauptkostenpunkt, nicht der einzelne Test.
- **Boot 4:** getrennte Test-Starter, neue Importpfade, `@MockitoBean` statt `@MockBean`.
- `@Transactional` im Test rollt zurück — deckt aber Fehler zu, die erst beim Bestätigen auftreten.
- Grün heißt „was geprüft wird, stimmt" — nicht „es ist genug geprüft".

## Weiterlesen

- [Testfälle formulieren](/infoblaetter/testfaelle) — was geprüft wird, bevor man es aufschreibt
- [DTOs und Schichten](/infoblaetter/dto-schichten) — warum sich saubere Schichten überhaupt einzeln testen lassen
- [Fehlerantworten](/infoblaetter/fehlerantworten) — die Fälle, die man im Slice-Test prüft
- [Docker und Container](/infoblaetter/docker) — die Datenbank, die der Integrationstest braucht
- [Gästebuch mit Tests](/tutorial-03/) — dort schreibst du alle drei Arten selbst
