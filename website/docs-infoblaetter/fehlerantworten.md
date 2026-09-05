---
title: Fehlerantworten
sidebar_label: Fehlerantworten
sidebar_position: 12
---

# Fehlerantworten

## Wofür eine Fehlerantwort da ist

Eine Schnittstelle wird von einem **Programm** benutzt, nicht von einem Menschen. Wenn etwas schiefgeht, muss dieses Programm allein entscheiden können, was jetzt zu tun ist:

| Was das Programm wissen muss | Was es daraus schließt |
|---|---|
| Habe **ich** einen Fehler gemacht? | Anfrage korrigieren — noch einmal senden bringt nichts |
| Hat der **Server** einen Fehler? | Später noch einmal versuchen |
| **Welches Feld** war falsch? | Dem Benutzer genau dieses Feld rot markieren |

Deshalb ist eine gute Fehlerantwort keine Höflichkeit. Sie ist die Hälfte der Schnittstelle.

:::danger Die Fehlerantwort, die alles kaputt macht
```
HTTP 200 OK
{ "erfolg": false, "meldung": "Lieferant nicht gefunden" }
```
Der Statuscode sagt „alles in Ordnung", der Rumpf sagt das Gegenteil. Jeder Client, jeder Proxy und jeder Zwischenspeicher glaubt dem Statuscode.

**Der Fehler steht im Statuscode.** Der Rumpf erklärt ihn nur.
:::

## Den richtigen Statuscode wählen

Die erste Ziffer trennt die Verantwortung: **4xx — der Client war es. 5xx — der Server war es.**

<svg viewBox="0 0 720 430" width="100%" role="img"
     aria-label="Entscheidungsbaum für Fehler-Statuscodes: Zuerst die Frage, ob der Client oder der Server schuld ist. Bei Client-Fehlern folgen 401, 403, 404, 400, 409 und 405."
     fontFamily="var(--ifm-font-family-base)">

  {/* Wurzel */}
  <rect x="236" y="12" width="248" height="52" rx="10"
        fill="var(--ifm-color-emphasis-200)"/>
  <rect x="236" y="12" width="248" height="52" rx="10" fill="none"
        stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <text x="360" y="34" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="var(--ifm-font-color-base)">Etwas ist schiefgegangen.</text>
  <text x="360" y="53" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Konnte der Client das verhindern?</text>

  {/* linker Ast: ja -> 4xx */}
  <path d="M 300 64 L 190 94" stroke="var(--ifm-color-emphasis-600)"
        strokeWidth="2" markerEnd="url(#pfeil-fehler)"/>
  <text x="216" y="84" fontSize="12" fontWeight="700"
        fill="var(--zeichnung-gruen)">ja</text>
  <defs>
    <marker id="pfeil-fehler" markerWidth="9" markerHeight="9" refX="8" refY="4.5"
            orient="auto">
      <path d="M 0 0 L 9 4.5 L 0 9 z" fill="var(--ifm-color-emphasis-600)"/>
    </marker>
  </defs>

  <rect x="16" y="96" width="348" height="34" rx="8"
        fill="var(--zeichnung-marke)"/>
  <text x="190" y="118" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="#ffffff">4xx — der Client muss etwas ändern</text>

  {/* rechter Ast: nein -> 5xx */}
  <path d="M 420 64 L 545 94" stroke="var(--ifm-color-emphasis-600)"
        strokeWidth="2" markerEnd="url(#pfeil-fehler)"/>
  <text x="480" y="84" fontSize="12" fontWeight="700"
        fill="var(--zeichnung-rot)">nein</text>

  <rect x="392" y="96" width="312" height="34" rx="8"
        fill="var(--ifm-color-danger-darkest)"/>
  <text x="548" y="118" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="#ffffff">5xx — der Server muss etwas ändern</text>

  <rect x="392" y="142" width="312" height="92" rx="9"
        fill="var(--ifm-color-danger-contrast-background)"/>
  <rect x="392" y="142" width="312" height="92" rx="9" fill="none"
        stroke="var(--ifm-color-danger-dark)" strokeWidth="1.5"/>
  <text x="410" y="166" fontSize="12.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-rot)">500 Internal Server Error</text>
  <text x="410" y="186" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Eine Ausnahme, die niemand vorgesehen hat.</text>
  <text x="410" y="206" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Der Client kann nichts tun außer warten.</text>
  <text x="410" y="226" fontSize="11.5" fontStyle="italic"
        fill="var(--zeichnung-rot)">Jede 500 ist ein Fehler in deinem Code.</text>

  {/* 4xx Faecher */}
  <rect x="16" y="150" width="348" height="34" rx="7"
        fill="var(--ifm-color-emphasis-100)"/>
  <rect x="16" y="150" width="348" height="34" rx="7" fill="none"
        stroke="var(--ifm-color-emphasis-400)"/>
  <text x="32" y="172" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">401</text>
  <text x="80" y="172" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Du hast dich nicht angemeldet</text>

  <rect x="16" y="190" width="348" height="34" rx="7"
        fill="var(--ifm-color-emphasis-100)"/>
  <rect x="16" y="190" width="348" height="34" rx="7" fill="none"
        stroke="var(--ifm-color-emphasis-400)"/>
  <text x="32" y="212" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">403</text>
  <text x="80" y="212" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Angemeldet, aber nicht berechtigt</text>

  <rect x="16" y="230" width="348" height="34" rx="7"
        fill="var(--ifm-color-emphasis-100)"/>
  <rect x="16" y="230" width="348" height="34" rx="7" fill="none"
        stroke="var(--ifm-color-emphasis-400)"/>
  <text x="32" y="252" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">404</text>
  <text x="80" y="252" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Diese Ressource gibt es nicht</text>

  <rect x="16" y="270" width="348" height="34" rx="7"
        fill="var(--ifm-color-emphasis-100)"/>
  <rect x="16" y="270" width="348" height="34" rx="7" fill="none"
        stroke="var(--ifm-color-emphasis-400)"/>
  <text x="32" y="292" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">400</text>
  <text x="80" y="292" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Die Anfrage selbst ist fehlerhaft</text>

  <rect x="16" y="310" width="348" height="34" rx="7"
        fill="var(--ifm-color-emphasis-100)"/>
  <rect x="16" y="310" width="348" height="34" rx="7" fill="none"
        stroke="var(--ifm-color-emphasis-400)"/>
  <text x="32" y="332" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">409</text>
  <text x="80" y="332" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Richtig gefragt, passt nur nicht zum Zustand</text>

  <rect x="16" y="350" width="348" height="34" rx="7"
        fill="var(--ifm-color-emphasis-100)"/>
  <rect x="16" y="350" width="348" height="34" rx="7" fill="none"
        stroke="var(--ifm-color-emphasis-400)"/>
  <text x="32" y="372" fontSize="12" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">405</text>
  <text x="80" y="372" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Adresse richtig, Verb falsch</text>

  <text x="16" y="412" fontSize="11.5" fontStyle="italic"
        fill="var(--ifm-color-emphasis-800)">401 und 403 vergibt in der Regel die Sicherheitsschicht, 405 der Server selbst — 400, 404 und 409 kommen aus deinem Code.</text>
</svg>

:::tip 400 oder 409 — der Unterschied, der am häufigsten falsch entschieden wird
**400** heißt: *Deine Anfrage ist kaputt.* Ein Pflichtfeld fehlt, ein Preis ist negativ, das JSON ist unvollständig. Der Client kann sie reparieren, ohne dass sich sonst etwas ändert.

**409** heißt: *Deine Anfrage ist in Ordnung — sie passt nur gerade nicht.* Der Lieferant soll gelöscht werden, hat aber noch Artikel. Am Feldinhalt ist nichts zu reparieren; **die Daten** müssen sich ändern.
:::

## Ein einheitliches Format: ProblemDetail

Früher hat sich jedes Projekt sein eigenes Fehlerformat ausgedacht. Seit **RFC 9457** gibt es dafür einen Standard, und Spring bringt ihn als Klasse `ProblemDetail` mit.

Eine Antwort sieht dann so aus — das ist eine echte Antwort aus dem Webshop-Projekt:

```json
{
  "title": "Nicht gefunden",
  "status": 404,
  "detail": "Es gibt keinen Lieferanten mit der Kennung 999999.",
  "instance": "/api/v1/suppliers/999999"
}
```

| Feld | Bedeutung |
|---|---|
| `title` | Kurzbezeichnung der Fehlerart — für **alle** Fehler dieser Art gleich |
| `status` | derselbe Code wie im HTTP-Kopf |
| `detail` | die Erklärung **für diesen einen Fall** |
| `instance` | die Adresse, bei der es passiert ist |
| `type` | optional: eine URL zur Beschreibung der Fehlerart |

Eingeschaltet wird das Format in der `application.properties`:

```properties
spring.mvc.problemdetails.enabled=true
server.error.include-stacktrace=never
```

Die zweite Zeile ist kein Schönheitsfehler-Fix, sondern Sicherheit: Ein Stacktrace verrät Paketnamen, Bibliotheksversionen und Dateipfade. Das ist Aufklärungsarbeit, die man Angreifern nicht abnehmen sollte.

## Fachliche Ausnahmen

Der Service kennt kein HTTP. Wenn er einen Lieferanten nicht findet, wirft er eine **fachliche** Ausnahme:

```java
public class SupplierNotFoundException extends RuntimeException {

    public SupplierNotFoundException(Long id) {
        super("Es gibt keinen Lieferanten mit der Kennung " + id + ".");
    }
}
```

Drei Eigenschaften machen sie brauchbar:

- sie erbt von `RuntimeException` — kein `throws` in jeder Signatur darüber
- ihr **Name** sagt, was fachlich passiert ist, nicht welcher Statuscode herauskommen soll
- die **Meldung** entsteht dort, wo die Information vorliegt

:::warning Warum nicht einfach `ResponseStatusException`?
```java
// verlockend, aber es zieht HTTP in den Service
throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nicht gefunden");
```
Damit weiß der Service plötzlich von Statuscodes. Wird derselbe Service später von einem Zeitplan-Auftrag oder einer anderen Schnittstelle benutzt, trägt er HTTP-Wissen mit sich herum, das dort niemanden interessiert.

Für einen ersten Prototyp ist die Abkürzung in Ordnung. Sobald es einen Service gibt, gehört die Übersetzung an die Grenze — siehe [DTOs und Schichten](/infoblaetter/dto-schichten).
:::

## Die Übersetzungsstelle: @RestControllerAdvice

Genau **eine** Klasse übersetzt fachliche Ausnahmen in HTTP-Antworten. Sie gilt für alle Controller gleichzeitig:

```java
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiExceptionHandler {

    @ExceptionHandler(SupplierNotFoundException.class)
    public ProblemDetail handleNotFound(SupplierNotFoundException ex) {
        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Nicht gefunden");
        return problem;
    }

    @ExceptionHandler(SupplierHasArticlesException.class)
    public ProblemDetail handleConflict(SupplierHasArticlesException ex) {
        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Löschen nicht möglich");
        return problem;
    }
}
```

Ohne diese Klasse käme aus jeder fachlichen Ausnahme eine **500** — der Server würde sich für einen Fehler entschuldigen, den der Client gemacht hat.

:::danger `@Order` ist hier nicht optional
Weil `spring.mvc.problemdetails.enabled=true` gesetzt ist, bringt Spring **bereits einen eigenen Ausnahmebehandler** mit. Der liegt auf `@Order(0)` und fängt unter anderem die Verstöße der Bean Validation ab.

Ohne `@Order(Ordered.HIGHEST_PRECEDENCE)` kommt deine Methode für diese Fälle **nie an die Reihe** — und zwar lautlos: kein Fehler, keine Warnung, nur eine Antwort, die anders aussieht als geplant. Das ist die Sorte Fehler, die man eine Stunde lang sucht.
:::

## Validierungsfehler feldweise

`@Valid` am Parameter lässt die Bean Validation zuschlagen, bevor eine Zeile Fachlogik läuft:

```java
@PostMapping
public ResponseEntity<SupplierDto> createSupplier(
        @Valid @RequestBody CreateSupplierDto dto) { … }
```

Spring antwortet daraufhin von sich aus mit 400 — allerdings nur mit `"detail": "Invalid request content."`. Welches Feld gemeint war, erfährt der Client nicht. Deshalb bekommt auch dieser Fall eine eigene Methode:

```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new LinkedHashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(
            error -> errors.put(error.getField(), error.getDefaultMessage()));

    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "Die Anfrage enthält ungültige Felder.");
    problem.setTitle("Ungültige Eingabe");
    problem.setProperty("errors", errors);
    return problem;
}
```

`setProperty` hängt ein zusätzliches Feld an das Standardformat — erlaubt und genau dafür vorgesehen. Die Antwort auf einen leeren Namen und eine leere Straße sieht dann so aus:

```json
{
  "title": "Ungültige Eingabe",
  "status": 400,
  "detail": "Die Anfrage enthält ungültige Felder.",
  "instance": "/api/v1/suppliers",
  "errors": {
    "contact.street": "Die Straße darf nicht leer sein.",
    "name": "Der Name darf nicht leer sein."
  }
}
```

Zwei Dinge daran sind bemerkenswert:

- Es kommen **alle** Verstöße auf einmal, nicht der erste. Der Benutzer korrigiert das Formular einmal statt viermal.
- Verschachtelte Felder tragen ihren Pfad: `contact.street`. Voraussetzung ist ein `@Valid` **auch am inneren Feld** des DTOs — ohne das prüft die Validierung nur die äußere Hülle.

Damit die Meldungen brauchbar sind, gehören sie an die Annotation:

```java
@NotBlank(message = "Der Name darf nicht leer sein.")
String name
```

Ohne `message` steht dort „must not be blank" — technisch richtig, im Formular unbrauchbar.

:::info Die Meldung ist deutsch, der Feldname englisch — Absicht
`"name": "Der Name darf nicht leer sein."` — der Schlüssel ist ein Bezeichner aus dem Quelltext und bleibt englisch. Der Text daneben ist für Menschen und darf in der Sprache der Anwendung stehen.
:::

## Was der Server nie preisgeben darf

| Nicht in die Antwort | Warum |
|---|---|
| Stacktraces | verraten Bibliotheken, Versionen und Pfade |
| SQL-Fragmente | zeigen Tabellen- und Spaltennamen |
| „User admin existiert nicht" | verrät, welche Benutzernamen es gibt |
| Interne Kennungen fremder Datensätze | lädt zum Durchprobieren ein |

**Die Regel:** So viel, dass der Client seinen Fehler beheben kann. Kein Wort mehr.

## Prüfliste für eine Fehlerantwort

- [ ] Der Statuscode passt zur Ursache — und ist nie 200
- [ ] 4xx nur, wenn der Client etwas ändern kann; sonst 5xx
- [ ] Die Antwort ist ein `ProblemDetail`, kein selbst erfundenes Format
- [ ] `detail` beschreibt **diesen** Fall, `title` die Fehlerart
- [ ] Bei Validierungsfehlern steht drin, **welches Feld** es war
- [ ] Kein Stacktrace, kein SQL, keine internen Pfade
- [ ] Die Übersetzung steht in **einer** `@RestControllerAdvice`-Klasse, nicht in jedem Controller
- [ ] `@Order(Ordered.HIGHEST_PRECEDENCE)`, wenn `problemdetails` eingeschaltet ist
- [ ] Für jeden Fehlerfall gibt es einen Test, der den Statuscode prüft

## Das Wichtigste in Kürze

- **Der Fehler steht im Statuscode**, der Rumpf erklärt ihn nur.
- **4xx** = der Client kann etwas ändern, **5xx** = er kann nur warten.
- **400** = Anfrage kaputt, **409** = Anfrage in Ordnung, passt nur nicht zum Zustand.
- `ProblemDetail` (RFC 9457) ist das Standardformat — nicht selbst eines erfinden.
- Fachliche Ausnahmen heißen nach der **Fachlichkeit**, nicht nach dem Statuscode.
- Eine `@RestControllerAdvice`-Klasse übersetzt sie — mit `@Order(Ordered.HIGHEST_PRECEDENCE)`.
- Validierungsfehler nennen **jedes betroffene Feld**, mit eigener `message`.

## Weiterlesen

- [HTTP kompakt](/infoblaetter/http-kompakt) — die Statuscodes im Überblick
- [DTOs und Schichten](/infoblaetter/dto-schichten) — warum HTTP nicht in den Service gehört
- [Automatisiert testen](/infoblaetter/automatisiert-testen) — Fehlerfälle prüft man am besten im Slice-Test
- [Gästebuch-Tutorial](/tutorial-02/02-antworten-gestalten) — dort baust du diese Übersetzungsstelle zum ersten Mal
