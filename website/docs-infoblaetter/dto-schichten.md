---
title: DTOs und Schichten
sidebar_label: DTOs und Schichten
sidebar_position: 11
---

# DTOs und Schichten

## Die Frage, mit der alles anfängt

Du hast eine Entität. Sie ist mit `@Entity` annotiert, Hibernate legt eine Tabelle dafür an, das Repository liefert sie. Warum sie dann nicht einfach herausgeben?

```java
@GetMapping("/{id}")
public Supplier findSupplierById(@PathVariable Long id) {
    return repository.findById(id).orElseThrow();
}
```

Das funktioniert. Beim ersten Versuch. Danach kommen fünf Probleme, und jedes einzelne kostet mehr Zeit, als die zwei Klassen gekostet hätten, die sie verhindern.

| | |
|---|---|
| **Die Antwort dreht sich im Kreis** | Der Lieferant kennt seine Artikel, jeder Artikel kennt seinen Lieferanten. Was dabei herauskommt, steht im nächsten Abschnitt |
| **Du verrätst zu viel** | `passwordHash`, `internalNote`, `deletedAt` — alles, was in der Tabelle steht, steht in der Antwort |
| **Der Client bricht, wenn du die Tabelle änderst** | Ein umbenanntes Feld ist eine Änderung der Datenbank. Sie darf nicht bei fremden Programmen ankommen |
| **Der Client darf Dinge setzen, die er nicht setzen darf** | Schickt er beim Anlegen eine `id` mit, überschreibt er womöglich einen fremden Datensatz |
| **Der Client braucht die Daten anders, als sie gespeichert sind** | Eine Oberfläche zeigt eine Kundenkarte. Die Datenbank hat den Kunden auf drei Tabellen verteilt |

**Die Lösung ist ein zweiter Satz Klassen** — nicht als Bürokratie, sondern als Grenze: eine Klasse für das, was in der Datenbank steht, und eine für das, was über die Leitung geht.

## Der Kreis — einmal wirklich gesehen

Von diesem Fehler liest man in jeder Anleitung einen Halbsatz. Ihn einmal gesehen zu haben, ist etwas anderes — vor allem, weil er sich **nicht als Fehler meldet**.

Die Ausgangslage sind zwei Entitäten, die aufeinander zeigen. Genau so steht es im Webshop-Projekt:

```java
@Entity
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
    private List<Article> articles = new ArrayList<>();
}
```

```java
@Entity
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String designation;

    @ManyToOne
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
}
```

Beide Richtungen sind gewollt: Vom Lieferanten zu seinen Artikeln, vom Artikel zurück zum Lieferanten. In der Datenbank ist das **eine** Spalte — `supplier_id` in der Artikeltabelle. Im Arbeitsspeicher sind es **zwei Verweise, die im Kreis zeigen**.

Und jetzt der Endpunkt, den man beim ersten Mal genau so schreibt:

```java
@GetMapping("/{id}")
public Supplier findSupplierById(@PathVariable Long id) {
    return repository.findById(id).orElseThrow();
}
```

### Was herauskommt

Ein Lieferant mit **einem einzigen** Artikel. Gemessen im Webshop-Projekt (Spring Boot 4.1.1, Jackson 3.1.5):

| | |
|---|---|
| **Statuscode** | `200 OK` |
| **Länge der Antwort** | 15 951 Zeichen |
| **Wie oft der eine Artikel darin steht** | 166 mal |
| **Verschachtelungstiefe** | 500 |
| **Meldung im Protokoll** | keine |

Der Anfang der Antwort:

```json
{"articles":[{"designation":"Wollpullover","id":41,"price":89.90,
 "supplier":{"articles":[{"designation":"Wollpullover","id":41,"price":89.90,
 "supplier":{"articles":[{"designation":"Wollpullover","id":41,"price":89.90,
 "supplier":{"articles":[ …
```

Und das Ende:

```json
 … "supplier":{"articles":[]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}
```

Der Serialisierer geht dem Verweis nach: Lieferant → Artikel → Lieferant → Artikel → … Er hört erst auf, als eine eingebaute Grenze greift — Jackson erlaubt höchstens 500 Ebenen Verschachtelung. Dann schließt er alle offenen Klammern und ist fertig.

:::danger Das Tückische ist nicht der Fehler, sondern dass keiner gemeldet wird
Der Statuscode sagt `200 OK`. Die Antwort ist **syntaktisch gültiges JSON** — jeder Parser nimmt sie an. Im Serverprotokoll steht nichts.

Der Client bekommt also keine Fehlermeldung, sondern eine Antwort, mit der er nichts anfangen kann. Wer nur auf den Statuscode schaut, sucht an der falschen Stelle — und zwar lange.

Mit älteren Jackson-Fassungen flog an dieser Stelle ein `StackOverflowError` und der Server antwortete mit 500. Das war lauter und deshalb ehrlicher gesagt: leichter zu finden.
:::

:::warning Warum das im eigenen Projekt plötzlich auftritt
Die Artikel sind mit `FetchType.LAZY` verknüpft — sie werden erst geladen, wenn jemand sie anfasst. In einem frisch erzeugten Spring-Boot-Projekt steht `spring.jpa.open-in-view` auf `true`. Die Datenbanksitzung bleibt dann offen, **bis die Antwort geschrieben ist**.

Damit ist es der Serialisierer selbst, der das Nachladen auslöst — und den Kreis in Gang setzt. Deshalb passiert im Test nichts und beim Aufruf über HTTP alles.
:::

### Die Reparaturen, die keine sind

| Versuch | Warum er nicht trägt |
|---|---|
| `@JsonIgnore` auf `articles` | Das Feld ist damit **überall** weg — auch dort, wo man die Artikel gerade braucht |
| `@JsonManagedReference` / `@JsonBackReference` | Funktioniert, aber die Entität trägt jetzt Wissen darüber, wie sie über HTTP aussieht. Zwei Aufgaben in einer Klasse |
| `fetch = FetchType.EAGER` umstellen | Ändert nichts am Kreis — lädt nur noch mehr Daten in ihn hinein |
| `open-in-view=false` setzen | Aus dem stillen Unsinn wird eine `LazyInitializationException`. Besser, aber immer noch kein Ergebnis, das der Client brauchen kann |

### Was das DTO daran ändert

Die Kette endet, weil das DTO an ihrem Ende **kein Objekt mehr trägt**, das zurückzeigt:

```java
public record ArticleDto(
        Long id,
        String designation,
        BigDecimal price,
        Long supplierId,
        String supplierName) {
}
```

Statt des ganzen Lieferanten stehen dort seine Kennung und sein Name. Damit weiß der Client, zu wem der Artikel gehört, und **kann trotzdem nicht im Kreis laufen**: Eine `Long` verweist auf nichts.

Das ist die Regel hinter allen DTO-Entwürfen mit Beziehungen:

> **An der Grenze der Antwort steht ein Wert, kein Verweis.** Wer mehr braucht, ruft den Endpunkt dafür auf.

## Was ein DTO ist

**DTO** steht für *Data Transfer Object*: ein Objekt, dessen einzige Aufgabe es ist, Daten von A nach B zu tragen. Kein Verhalten, keine Regeln, keine Datenbank-Annotationen. In Java ist ein `record` dafür genau das richtige Werkzeug.

```java
public record SupplierDto(
        Long id,
        String name,
        ContactDto contact,
        long articleCount) {
}
```

Ein `record` ist unveränderlich, hat automatisch Konstruktor, Getter, `equals` und `toString` — und passt in vier Zeilen. Genau deshalb sind DTOs keine Fleißarbeit.

:::info Entität und DTO sehen sich ähnlich — sie sind es nicht
Die Entität beantwortet die Frage: **Wie speichern wir das?** Das DTO beantwortet: **Was zeigen wir davon?**

Dass beide anfangs fast dieselben Felder haben, ist normal. Der Punkt ist, dass sie sich **unabhängig voneinander ändern dürfen**. Genau das ist die Leistung.
:::

## Zwei Richtungen, zwei DTOs

Ein einziges DTO für hin und zurück sieht sparsam aus und ist es nicht. Was hineingeht und was herauskommt, ist nicht dasselbe:

<svg viewBox="0 0 720 250" width="100%" role="img"
     aria-label="Zwei DTOs: Der Client schickt ein CreateSupplierDto ohne Kennung an den Server, der Server antwortet mit einem SupplierDto, das Kennung und Artikelanzahl enthält"
     fontFamily="var(--ifm-font-family-base)">

  {/* ---------------- hinein ---------------- */}
  <text x="24" y="26" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Hinein: was der Client schicken darf</text>

  <rect x="24" y="38" width="250" height="86" rx="9"
        fill="var(--ifm-color-info-contrast-background)"/>
  <rect x="24" y="38" width="250" height="86" rx="9" fill="none"
        stroke="var(--ifm-color-info-dark)" strokeWidth="1.6"/>
  <text x="40" y="60" fontSize="12.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-blau)">CreateSupplierDto</text>
  <text x="40" y="80" fontSize="12" fill="var(--ifm-color-emphasis-800)">name</text>
  <text x="40" y="98" fontSize="12" fill="var(--ifm-color-emphasis-800)">contact</text>
  <text x="40" y="116" fontSize="11" fontStyle="italic"
        fill="var(--zeichnung-rot)">keine id, kein createdAt</text>

  <path d="M 284 80 L 428 80" stroke="var(--ifm-color-emphasis-600)"
        strokeWidth="2" fill="none" markerEnd="url(#pfeil-dto)"/>
  <defs>
    <marker id="pfeil-dto" markerWidth="9" markerHeight="9" refX="8" refY="4.5"
            orient="auto">
      <path d="M 0 0 L 9 4.5 L 0 9 z" fill="var(--ifm-color-emphasis-600)"/>
    </marker>
  </defs>
  <text x="356" y="72" textAnchor="middle" fontSize="11" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">POST</text>

  {/* ---------------- Server ---------------- */}
  <rect x="436" y="38" width="250" height="86" rx="9"
        fill="var(--ifm-color-emphasis-200)"/>
  <rect x="436" y="38" width="250" height="86" rx="9" fill="none"
        stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.6"/>
  <text x="561" y="72" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="var(--ifm-font-color-base)">Server</text>
  <text x="561" y="94" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">vergibt die Kennung,</text>
  <text x="561" y="110" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">setzt den Zeitstempel</text>

  {/* ---------------- heraus ---------------- */}
  <text x="24" y="164" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Heraus: was der Server zeigt</text>

  <rect x="436" y="176" width="250" height="64" rx="9"
        fill="var(--ifm-color-success-contrast-background)"/>
  <rect x="436" y="176" width="250" height="64" rx="9" fill="none"
        stroke="var(--ifm-color-success-dark)" strokeWidth="1.6"/>
  <text x="452" y="198" fontSize="12.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-gruen)">SupplierDto</text>
  <text x="452" y="216" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">id, name, contact,</text>
  <text x="452" y="232" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">articleCount</text>

  <path d="M 428 208 L 284 208" stroke="var(--ifm-color-emphasis-600)"
        strokeWidth="2" fill="none" markerEnd="url(#pfeil-dto)"/>
  <text x="356" y="200" textAnchor="middle" fontSize="11" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">201</text>

  <rect x="24" y="176" width="250" height="64" rx="9"
        fill="var(--ifm-color-emphasis-100)"/>
  <rect x="24" y="176" width="250" height="64" rx="9" fill="none"
        stroke="var(--ifm-color-emphasis-400)" strokeWidth="1.4"
        strokeDasharray="5 4"/>
  <text x="149" y="204" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Der Client erfährt jetzt,</text>
  <text x="149" y="222" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">welche Kennung er bekommen hat</text>
</svg>

Die Regel dahinter lautet: **Ein Feld, das der Client nicht setzen darf, hat im Eingangs-DTO nichts verloren.** Nicht „wir ignorieren es dann halt" — es steht gar nicht erst da. Was nicht existiert, kann nicht missbraucht werden.

Deshalb heißen die beiden Klassen im Webshop-Tutorial `CreateSupplierDto` und `SupplierDto`. Das Präfix `Create` sagt: Das ist die Anfrage, nicht die Antwort.

## Der Client bestimmt den Schnitt, nicht die Tabelle

Die vier Punkte oben sind Schutzargumente: Sie sagen, was schiefgeht, wenn man die Entität herausgibt. Der fünfte ist ein Entwurfsargument — und im Alltag der wichtigste.

**Eine Schnittstelle wird für einen Zweck benutzt.** Am anderen Ende sitzt ein Programm, das etwas vorhat: eine Kundenkarte anzeigen, eine Bestellung aufgeben, eine Liste durchblättern. Die Frage, die den Endpunkt entwirft, lautet deshalb nicht „welche Tabellen haben wir?", sondern:

> **Was will der Client tun — und welche Daten braucht er dafür in einem Stück?**

Datenbanken sind auf Speichern hin entworfen: Redundanz vermeiden, Daten auf Tabellen verteilen, jede Sache genau einmal ablegen. Eine Oberfläche ist auf Anzeigen hin entworfen: alles beisammen, was zusammen auf den Bildschirm gehört. Das sind zwei verschiedene Ziele — und deshalb dürfen die Antworten der Schnittstelle nicht so geschnitten sein wie die Tabellen.

### Ein Beispiel

Eine Anwendung zeigt eine Kundenkarte: Name, Anschrift, Telefonnummer. In der Datenbank liegt das auf drei Tabellen — der Kunde, seine Anschrift, seine Kontaktwege.

<svg viewBox="0 0 720 300" width="100%" role="img"
     aria-label="Links drei Tabellen für Kunde, Anschrift und Kontakt. Rechts eine Kundenkarte in der Oberfläche, die alle drei Angaben zusammen zeigt. Ein einziger Endpunkt liefert alles in einer Antwort."
     fontFamily="var(--ifm-font-family-base)">

  <text x="16" y="24" fontSize="13" fontWeight="700"
        fill="var(--ifm-font-color-base)">So ist es gespeichert</text>

  <rect x="16" y="38" width="180" height="52" rx="8"
        fill="var(--ifm-color-warning-contrast-background)"/>
  <rect x="16" y="38" width="180" height="52" rx="8" fill="none"
        stroke="var(--ifm-color-warning-dark)" strokeWidth="1.5"/>
  <text x="32" y="60" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-font-color-base)">customer</text>
  <text x="32" y="80" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">id, first_name, last_name</text>

  <rect x="16" y="102" width="180" height="52" rx="8"
        fill="var(--ifm-color-warning-contrast-background)"/>
  <rect x="16" y="102" width="180" height="52" rx="8" fill="none"
        stroke="var(--ifm-color-warning-dark)" strokeWidth="1.5"/>
  <text x="32" y="124" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-font-color-base)">address</text>
  <text x="32" y="144" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">street, postcode, city</text>

  <rect x="16" y="166" width="180" height="52" rx="8"
        fill="var(--ifm-color-warning-contrast-background)"/>
  <rect x="16" y="166" width="180" height="52" rx="8" fill="none"
        stroke="var(--ifm-color-warning-dark)" strokeWidth="1.5"/>
  <text x="32" y="188" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-font-color-base)">contact</text>
  <text x="32" y="208" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">phone, email</text>

  <text x="16" y="248" fontSize="11.5" fontStyle="italic"
        fill="var(--ifm-color-emphasis-800)">Getrennt, damit nichts doppelt</text>
  <text x="16" y="266" fontSize="11.5" fontStyle="italic"
        fill="var(--ifm-color-emphasis-800)">gespeichert wird.</text>

  <path d="M 210 128 L 286 128" stroke="var(--zeichnung-akzent)" strokeWidth="2.2"
        markerEnd="url(#pfeil-schnitt)"/>
  <defs>
    <marker id="pfeil-schnitt" markerWidth="9" markerHeight="9" refX="8" refY="4.5"
            orient="auto">
      <path d="M 0 0 L 9 4.5 L 0 9 z" fill="var(--zeichnung-akzent)"/>
    </marker>
  </defs>
  <text x="248" y="118" textAnchor="middle" fontSize="11" fontWeight="700"
        fill="var(--zeichnung-akzent)">ein</text>
  <text x="248" y="152" textAnchor="middle" fontSize="11" fontWeight="700"
        fill="var(--zeichnung-akzent)">Aufruf</text>

  <text x="300" y="24" fontSize="13" fontWeight="700"
        fill="var(--ifm-font-color-base)">So wird es gebraucht</text>

  <rect x="300" y="38" width="220" height="180" rx="10"
        fill="var(--ifm-color-info-contrast-background)"/>
  <rect x="300" y="38" width="220" height="180" rx="10" fill="none"
        stroke="var(--ifm-color-info-dark)" strokeWidth="1.6"/>
  <text x="320" y="66" fontSize="13" fontWeight="700"
        fill="var(--ifm-font-color-base)">Anna Meyer</text>
  <text x="320" y="92" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Am Deich 12</text>
  <text x="320" y="112" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">28199 Bremen</text>
  <text x="320" y="140" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">0421 123456</text>
  <text x="320" y="160" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">anna.meyer@example.de</text>
  <text x="320" y="196" fontSize="11" fontStyle="italic"
        fill="var(--zeichnung-blau)">eine Karte, ein Blick</text>

  <rect x="540" y="38" width="164" height="180" rx="10"
        fill="var(--ifm-color-success-contrast-background)"/>
  <rect x="540" y="38" width="164" height="180" rx="10" fill="none"
        stroke="var(--ifm-color-success-dark)" strokeWidth="1.6"/>
  <text x="556" y="64" fontSize="12" fontWeight="700"
        fill="var(--zeichnung-gruen)">CustomerCardDto</text>
  <text x="556" y="88" fontSize="11" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">id</text>
  <text x="556" y="108" fontSize="11" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">fullName</text>
  <text x="556" y="128" fontSize="11" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">address</text>
  <text x="556" y="148" fontSize="11" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">phone</text>
  <text x="556" y="168" fontSize="11" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">email</text>
  <text x="556" y="200" fontSize="11" fontStyle="italic"
        fill="var(--ifm-color-emphasis-800)">nach dem Zweck</text>
  <text x="556" y="214" fontSize="11" fontStyle="italic"
        fill="var(--ifm-color-emphasis-800)">geschnitten</text>
</svg>

Wer die Tabellen eins zu eins nach außen reicht, zwingt den Client zu drei Aufrufen für **eine** Karte:

```http
GET /api/v1/customers/42
GET /api/v1/customers/42/address
GET /api/v1/customers/42/contact
```

Drei Anfragen, drei Wartezeiten, drei Fehlerfälle, die der Client einzeln behandeln muss — und eine Oberfläche, die halb gefüllt dasteht, wenn die zweite Anfrage hängt. Für eine Liste von zwanzig Kunden werden daraus **einundsechzig** Aufrufe.

Ein Endpunkt, der nach dem Zweck geschnitten ist, liefert dasselbe in einem Stück:

```http
GET /api/v1/customers/42
```

```json
{
  "id": 42,
  "fullName": "Anna Meyer",
  "address": { "street": "Am Deich 12", "postcode": "28199", "city": "Bremen" },
  "phone": "0421 123456",
  "email": "anna.meyer@example.de"
}
```

Beachte `fullName`: In der Datenbank stehen Vor- und Nachname getrennt — und das ist dort richtig, denn nur so lässt sich nach dem Nachnamen sortieren. Wenn aber **jeder** Client die beiden ohnehin sofort zusammensetzt, gehört das auf die Serverseite. Sonst schreiben fünf Clients dieselbe Zeile fünfmal — und der sechste macht es anders.

### Die zwei Fehlerarten

| | Was passiert | Woran man es merkt |
|---|---|---|
| **Zu wenig geliefert** | Der Client muss nachfragen, um eine Ansicht zu füllen | Für eine Seite braucht es fünf Aufrufe. Man nennt das eine *geschwätzige* Schnittstelle |
| **Zu viel geliefert** | Jede Antwort schleppt Felder mit, die niemand ansieht | Die Liste holt zu jedem Lieferanten seine 400 Artikel, angezeigt wird eine Zahl |

Genau der zweite Fall steckt im Webshop-Tutorial:

```java
public record SupplierDto(
        Long id,
        String name,
        ContactDto contact,
        long articleCount) {
}
```

`articleCount` statt `List<ArticleDto>` — weil die Übersicht eine **Zahl** zeigt. Wer die Artikel wirklich sehen will, ruft den Endpunkt dafür auf:

```http
GET /api/v1/suppliers/7/articles
```

:::tip Dieselbe Sache, zwei Ansichten, zwei DTOs
Eine Übersichtsliste und eine Detailansicht brauchen selten dasselbe. Es ist völlig in Ordnung, für eine Ressource zwei Ausgabe-DTOs zu haben — etwa `SupplierSummaryDto` mit drei Feldern für die Liste und `SupplierDto` mit allem für die Einzelansicht.

Das ist keine Verdopplung, sondern eine Entscheidung: Für jede Ansicht steht an genau einer Stelle geschrieben, was sie braucht.
:::

:::warning Die Grenze: nicht ein Endpunkt je Bildschirm
Die Umkehrung wäre genauso falsch. Wenn jeder neue Knopf in der Oberfläche einen neuen Endpunkt bekommt, hängt die Schnittstelle an einem bestimmten Client — und der nächste, den es noch gar nicht gibt, passt nicht mehr.

Die Mitte: Der Zuschnitt folgt dem **fachlichen Vorgang** („eine Kundenkarte anzeigen", „eine Bestellung aufgeben"), nicht dem einzelnen Bildschirmelement. Ein Vorgang überlebt die Umgestaltung der Oberfläche.
:::

### Die Frage, die man sich vor jedem Endpunkt stellt

1. **Wer ruft das auf, und was hat er damit vor?**
2. **Welche Felder braucht er dafür — und welche ganz sicher nicht?**
3. **Muss er nach dieser Antwort noch einmal fragen, um seine Ansicht zu füllen?** Wenn ja: Ist das der Regelfall oder die Ausnahme?
4. **Wird ein Feld bei jedem Client gleich umgerechnet oder zusammengesetzt?** Dann gehört es fertig in die Antwort.

Diese vier Fragen beantwortet man **bevor** man das DTO schreibt. Das DTO ist das Ergebnis der Antworten — nicht eine Kopie der Entität, aus der man hinterher Felder streicht.

## Die Schichten

DTOs sind nur die eine Hälfte. Die andere ist die Frage, **wer wen kennen darf**.

<svg viewBox="0 0 720 400" width="100%" role="img"
     aria-label="Die vier Schichten einer Spring-Boot-Anwendung: Controller, Service, Repository und Datenbank. Oberhalb des Service fließen DTOs, unterhalb Entitäten. Der Mapper sitzt an der Grenze."
     fontFamily="var(--ifm-font-family-base)">

  {/* Schicht 1: Controller */}
  <rect x="120" y="16" width="400" height="66" rx="10"
        fill="var(--ifm-color-info-contrast-background)"/>
  <rect x="120" y="16" width="400" height="66" rx="10" fill="none"
        stroke="var(--ifm-color-info-dark)" strokeWidth="1.8"/>
  <text x="140" y="42" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Controller</text>
  <text x="140" y="64" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">nimmt HTTP entgegen, gibt HTTP zurück — sonst nichts</text>
  <text x="504" y="42" textAnchor="end" fontSize="11" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-blau)">@RestController</text>

  {/* Schicht 2: Service */}
  <rect x="120" y="106" width="400" height="66" rx="10"
        fill="var(--ifm-color-success-contrast-background)"/>
  <rect x="120" y="106" width="400" height="66" rx="10" fill="none"
        stroke="var(--ifm-color-success-dark)" strokeWidth="1.8"/>
  <text x="140" y="132" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Service</text>
  <text x="140" y="154" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">die fachlichen Regeln — hier wohnt das Wissen</text>
  <text x="504" y="132" textAnchor="end" fontSize="11" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-gruen)">@Service</text>

  {/* Schicht 3: Repository */}
  <rect x="120" y="196" width="400" height="66" rx="10"
        fill="var(--ifm-color-warning-contrast-background)"/>
  <rect x="120" y="196" width="400" height="66" rx="10" fill="none"
        stroke="var(--ifm-color-warning-dark)" strokeWidth="1.8"/>
  <text x="140" y="222" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Repository</text>
  <text x="140" y="244" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">lesen und schreiben — du schreibst nur die Signatur</text>
  <text x="504" y="222" textAnchor="end" fontSize="11" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-gelb)">JpaRepository</text>

  {/* Schicht 4: Datenbank */}
  <rect x="120" y="286" width="400" height="56" rx="10"
        fill="var(--ifm-color-emphasis-200)"/>
  <rect x="120" y="286" width="400" height="56" rx="10" fill="none"
        stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <text x="140" y="320" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Datenbank</text>

  {/* Pfeile abwärts */}
  <path d="M 320 82 L 320 104" stroke="var(--ifm-color-emphasis-600)"
        strokeWidth="2" markerEnd="url(#pfeil-schicht)"/>
  <path d="M 320 172 L 320 194" stroke="var(--ifm-color-emphasis-600)"
        strokeWidth="2" markerEnd="url(#pfeil-schicht)"/>
  <path d="M 320 262 L 320 284" stroke="var(--ifm-color-emphasis-600)"
        strokeWidth="2" markerEnd="url(#pfeil-schicht)"/>
  <defs>
    <marker id="pfeil-schicht" markerWidth="9" markerHeight="9" refX="8" refY="4.5"
            orient="auto">
      <path d="M 0 0 L 9 4.5 L 0 9 z" fill="var(--ifm-color-emphasis-600)"/>
    </marker>
  </defs>

  {/* linke Spalte: was fliesst */}
  <text x="16" y="42" fontSize="12" fontWeight="700"
        fill="var(--zeichnung-akzent)">DTO</text>
  <path d="M 40 52 L 40 128" stroke="var(--zeichnung-akzent)" strokeWidth="2.5"
        strokeLinecap="round"/>

  <text x="16" y="232" fontSize="12" fontWeight="700"
        fill="var(--zeichnung-gelb)">Entität</text>
  <path d="M 40 148 L 40 306" stroke="var(--zeichnung-gelb)" strokeWidth="2.5"
        strokeLinecap="round"/>

  {/* Mapper an der Grenze */}
  <rect x="548" y="106" width="150" height="66" rx="9"
        fill="var(--ifm-background-surface-color)"/>
  <rect x="548" y="106" width="150" height="66" rx="9" fill="none"
        stroke="var(--zeichnung-akzent)" strokeWidth="1.8" strokeDasharray="6 4"/>
  <text x="623" y="132" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="var(--zeichnung-akzent)">Mapper</text>
  <text x="623" y="154" textAnchor="middle" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">übersetzt zwischen beiden</text>
  <path d="M 544 139 L 524 139" stroke="var(--zeichnung-akzent)" strokeWidth="1.8"/>

  {/* Fussnote */}
  <text x="120" y="372" fontSize="11.5" fontStyle="italic"
        fill="var(--ifm-color-emphasis-800)">Die Pfeile zeigen nur nach unten: Der Service kennt das Repository, das Repository kennt den Service nicht.</text>
</svg>

Jede Schicht kennt nur die **direkt darunter**. Diese eine Regel bringt drei Dinge mit, die man sonst mühsam nachrüstet:

- **Ersetzbarkeit** — die Datenbank wechseln, ohne den Controller anzufassen
- **Testbarkeit** — jede Schicht lässt sich für sich prüfen, weil man die darunter durch ein Doppel ersetzen kann (siehe [Automatisiert testen](/infoblaetter/automatisiert-testen))
- **Auffindbarkeit** — bei einem Fehler ist die Frage nicht „wo im Programm?", sondern „in welcher Schicht?"

## Was in welche Schicht gehört

| | gehört hinein | gehört **nicht** hinein |
|---|---|---|
| **Controller** | Adresse und HTTP-Verb, Statuscode, `Location`-Kopf, `@Valid` | `if`-Regeln, Rechnungen, Repository-Aufrufe |
| **Service** | fachliche Regeln, Ausnahmen werfen, `@Transactional`, Mapper aufrufen | `ResponseEntity`, Statuscodes, `HttpServletRequest` |
| **Repository** | Methodensignaturen, `@Query` im Ausnahmefall | Regeln, Berechnungen, DTOs |
| **Entität** | Felder, Beziehungen, Datenbank-Annotationen | Jackson-Annotationen, Validierung für die Schnittstelle |
| **DTO** | Felder, Validierungs-Annotationen | Methoden mit Logik, JPA-Annotationen |

:::warning Der häufigste Verstoß: das Repository im Controller
```java
// so nicht
@GetMapping("/{id}")
public SupplierDto findById(@PathVariable Long id) {
    return mapper.toDto(repository.findById(id).orElseThrow());
}
```
Das läuft — bis die erste Regel dazukommt („gelöschte Lieferanten nicht anzeigen"). Dann steht sie im Controller, und der nächste Endpunkt, der dasselbe braucht, hat sie nicht.

Der Service ist keine Durchreiche, die man sich sparen kann. Er ist der Ort, an dem die Regel **einmal** steht.
:::

## Der Mapper

Irgendwer muss Entität und DTO ineinander übersetzen. Diese Arbeit bekommt eine eigene Klasse:

```java
@Component
public class SupplierMapper {

    public SupplierDto toDto(Supplier supplier, long articleCount) {
        return new SupplierDto(
                supplier.getId(),
                supplier.getName(),
                toDto(supplier.getContact()),
                articleCount);
    }

    public Supplier toEntity(CreateSupplierDto dto) {
        Supplier supplier = new Supplier();
        supplier.setName(dto.name());
        supplier.setContact(toEntity(dto.contact()));
        return supplier;
    }
}
```

Drei Dinge sind daran wichtig:

1. **`toEntity` setzt keine `id`.** Die vergibt die Datenbank. Ein Mapper, der die Kennung aus dem Eingangs-DTO übernimmt, hebelt genau den Schutz aus, für den es das Eingangs-DTO gibt.
2. **Die Klasse weiß nichts von HTTP und nichts von der Datenbank.** Deshalb ist sie mit `new SupplierMapper()` testbar — ohne Spring, ohne Datenbank, in Millisekunden.
3. **Sie steht neben dem Service, nicht neben dem Controller.** Der Controller soll das DTO bekommen, nicht es sich selbst zusammenbauen.

:::tip Es gibt Werkzeuge, die den Mapper erzeugen
**MapStruct** schreibt solche Methoden zur Übersetzungszeit selbst. In großen Projekten spart das viel Tipparbeit.

Für die Ausbildung ist die Handarbeit trotzdem der bessere Weg: Wer den Mapper einmal selbst geschrieben hat, sieht sofort, was ein erzeugter tut — und was er falsch macht, wenn er es tut.
:::

## Wenn LazyInitializationException auftritt

Ein Fehler, der genau an der Schichtgrenze entsteht: Der Service holt eine Entität, gibt sie zurück, und **erst der Mapper** greift auf eine faul geladene Beziehung zu. Zu diesem Zeitpunkt ist die Datenbank-Sitzung schon geschlossen.

Zwei Stellschrauben:

- `spring.jpa.open-in-view=false` in der `application.properties` — sie sorgt dafür, dass dieser Fehler früh und deutlich auftritt statt spät und unauffällig
- **`@Transactional` auf der Service-Methode** — dann bleibt die Sitzung offen, solange der Service arbeitet, und der Mapper darf zugreifen

Die Einzelheiten dazu stehen im Infoblatt [Beziehungen mit JPA abbilden](/infoblaetter/jpa-beziehungen).

## Das Wichtigste in Kürze

- Die **Entität** beschreibt die Speicherung, das **DTO** die Schnittstelle. Beide dürfen sich getrennt entwickeln.
- Gibt man die Entität heraus, **meldet sich kein Fehler**: Der Kreis zwischen zwei Entitäten liefert 200 OK und 16 kB Unsinn.
- Ein Endpunkt wird nach dem **Vorhaben des Clients** geschnitten, nicht nach dem Aufbau der Tabellen.
- **Zwei DTOs pro Ressource:** eines für hinein (ohne `id`, ohne Zeitstempel), eines für heraus.
- Ein DTO ist ein `record` — vier Zeilen, keine Logik.
- Jede Schicht kennt nur die **direkt darunter**. Nie das Repository aus dem Controller.
- Der **Mapper** ist eine eigene Klasse, kennt weder HTTP noch Datenbank und ist deshalb ohne Spring testbar.
- Bei `LazyInitializationException`: `@Transactional` auf die Service-Methode, nicht `open-in-view` wieder einschalten.

## Weiterlesen

- [Fehlerantworten](/infoblaetter/fehlerantworten) — was passiert, wenn eine Schicht eine Regel verletzt sieht
- [Beziehungen mit JPA abbilden](/infoblaetter/jpa-beziehungen) — warum die Entität sich nicht als Antwort eignet
- [Automatisiert testen](/infoblaetter/automatisiert-testen) — jede Schicht bekommt ihre eigene Testart
- [Webshop-Tutorial](/tutorial-04/) — dort baust du diese Schichten selbst
