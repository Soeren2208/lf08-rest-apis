---
id: http-kompakt
title: HTTP kompakt
sidebar_label: HTTP kompakt
sidebar_position: 3
---

# HTTP kompakt

HTTP ist die Sprache, in der Client und Server miteinander reden. Jeder Aufruf einer REST-API ist eine HTTP-Nachricht. Wer HTTP versteht, kann jede REST-API lesen.

(Andere Baustile sind nicht darauf festgelegt — SOAP kann seine Nachrichten auch über andere Wege schicken. Für REST ist HTTP nicht Beiwerk, sondern Teil des Konzepts.)

## Ein Aufruf besteht aus zwei Nachrichten

<svg viewBox="0 0 720 300" width="100%" role="img"
     aria-label="Zwei getrennte Aufrufe: nach jeder Antwort ist die Verbindung beendet"
     fontFamily="var(--ifm-font-family-base)">

  {/* Köpfe */}
  <g transform="translate(20,10)">
    <rect width="150" height="40" rx="9" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <text x="75" y="26" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--ifm-font-color-base)">Client</text>
  </g>
  <g transform="translate(550,10)">
    <rect width="150" height="40" rx="9" fill="var(--ifm-color-primary)" opacity="0.12"/>
    <rect width="150" height="40" rx="9" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.6"/>
    <text x="75" y="26" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--ifm-font-color-base)">Server</text>
  </g>
  <path d="M95 50 L95 290" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.6" strokeDasharray="5 5"/>
  <path d="M625 50 L625 290" stroke="var(--ifm-color-primary)" strokeWidth="1.6" strokeDasharray="5 5" opacity="0.5"/>

  {/* Erster Aufruf */}
  <rect x="70" y="70" width="580" height="76" rx="10" fill="var(--ifm-color-emphasis-100)" opacity="0.6"/>
  <text x="82" y="88" fontSize="11.5" fontWeight="700" fill="var(--ifm-color-emphasis-700)">Erster Aufruf</text>
  <path d="M108 108 L611 108" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <path d="M604 103 L613 108 L604 113" fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <text x="360" y="102" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-font-color-base)">Request — die Anfrage</text>
  <path d="M611 132 L108 132" stroke="var(--ifm-color-primary)" strokeWidth="2" strokeDasharray="6 4"/>
  <path d="M115 127 L106 132 L115 137" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <text x="360" y="126" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-primary)">Response — die Antwort</text>

  {/* Trennung */}
  <path d="M70 166 L650 166" stroke="var(--ifm-color-danger)" strokeWidth="1.6" strokeDasharray="7 5"/>
  <g transform="translate(283,152)">
    <rect width="154" height="28" rx="14" fill="var(--ifm-background-color)" stroke="var(--ifm-color-danger)" strokeWidth="1.5"/>
    <text x="77" y="19" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ifm-color-danger)">Anfrage abgeschlossen</text>
  </g>

  {/* Zweiter Aufruf */}
  <rect x="70" y="192" width="580" height="76" rx="10" fill="var(--ifm-color-emphasis-100)" opacity="0.6"/>
  <text x="82" y="210" fontSize="11.5" fontWeight="700" fill="var(--ifm-color-emphasis-700)">Zweiter Aufruf — beginnt bei null</text>
  <path d="M108 230 L611 230" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <path d="M604 225 L613 230 L604 235" fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <text x="360" y="224" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-font-color-base)">Request — die Anfrage</text>
  <path d="M611 254 L108 254" stroke="var(--ifm-color-primary)" strokeWidth="2" strokeDasharray="6 4"/>
  <path d="M115 249 L106 254 L115 259" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <text x="360" y="248" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-primary)">Response — die Antwort</text>

  <text x="360" y="290" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Der Server erinnert sich an den ersten Aufruf nicht — das ist Zustandslosigkeit</text>
</svg>

Mehr passiert nicht. Der Client fragt, der Server antwortet, die Anfrage ist damit abgeschlossen. Für die nächste Frage beginnt alles von vorn — genau das meint **Zustandslosigkeit**.

:::note Abgeschlossen heißt nicht „Leitung gekappt"
Die **Verbindung** bleibt in der Regel bestehen: HTTP/1.1 hält sie offen, damit nicht für jedes Bild und jede Anfrage neu verbunden werden muss.

Zustandslosigkeit ist eine Aussage über etwas anderes — über das **Gedächtnis** des Servers. Er merkt sich zwischen zwei Anfragen nichts über den Gesprächsverlauf, auch wenn beide über dieselbe Verbindung laufen.
:::

## Aufbau einer Anfrage

```http
POST /api/v1/persons HTTP/1.1        ← Startzeile: Methode, Pfad, Version
Host: localhost:8080                  ┐
Content-Type: application/json        │ Header (Kopfzeilen)
Accept: application/json              ┘
                                      ← Leerzeile trennt Kopf und Rumpf
{"firstname":"Anna","surname":"Schmidt"}   ← Body (Rumpf, optional)
```

| Teil | Bedeutung |
|---|---|
| **Methode** | Was soll passieren? `GET`, `POST`, `PUT`, `DELETE` … |
| **Pfad** | Womit? Die Adresse der Ressource |
| **Header** | Zusatzangaben — Datenformat, Anmeldung, Sprache … |
| **Body** | Die mitgeschickten Daten. Bei `GET` und `DELETE` normalerweise leer |

## Aufbau einer Antwort

```http
HTTP/1.1 201 Created                  ← Statuszeile: Code und Kurztext
Content-Type: application/json        ┐ Header
Location: /api/v1/persons/1           ┘
                                      ← Leerzeile
{"firstname":"Anna","id":1,"surname":"Schmidt"}   ← Body
```

## Die HTTP-Methoden

| Methode | Zweck | CRUD | Body in der Anfrage? |
|---|---|---|:--:|
| `GET` | Daten abrufen | Read | nein |
| `POST` | Neue Ressource anlegen | Create | ja |
| `PUT` | Ressource **vollständig** ersetzen | Update | ja |
| `PATCH` | Ressource **teilweise** ändern | Update | ja |
| `DELETE` | Ressource löschen | Delete | nein |

:::tip PUT oder PATCH?
`PUT` schickt den **kompletten** neuen Stand — fehlende Felder werden geleert.
`PATCH` schickt **nur die Änderung** — alles andere bleibt.

Für eine Person mit Vor- und Nachnamen:
- `PUT` mit `{"firstname":"Anna"}` → der Nachname wäre danach leer.
- `PATCH` mit `{"firstname":"Anna"}` → der Nachname bleibt stehen.

In diesen Tutorials verwenden wir `PUT`.
:::

## Statuscodes

Jede Antwort trägt einen dreistelligen Code. Die **erste Ziffer** sagt schon das Wichtigste:

<svg viewBox="0 0 720 250" width="100%" role="img"
     aria-label="Die fünf Statuscode-Gruppen: 1xx Information, 2xx Erfolg, 3xx Umleitung, 4xx Client-Fehler, 5xx Server-Fehler"
     fontFamily="var(--ifm-font-family-base)">

  <g transform="translate(14,14)">
    <rect width="130" height="152" rx="11" fill="var(--ifm-color-emphasis-300)" opacity="0.35"/>
    <rect width="130" height="152" rx="11" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.6"/>
    <text x="65" y="46" textAnchor="middle" fontSize="26" fontWeight="800" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">1xx</text>
    <text x="65" y="76" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Information</text>
    <text x="65" y="106" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-700)">Moment noch …</text>
    <text x="65" y="134" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-600)">selten</text>
  </g>

  <g transform="translate(154,14)">
    <rect width="130" height="152" rx="11" fill="var(--ifm-color-success)" opacity="0.18"/>
    <rect width="130" height="152" rx="11" fill="none" stroke="var(--ifm-color-success-dark)" strokeWidth="1.8"/>
    <text x="65" y="46" textAnchor="middle" fontSize="26" fontWeight="800" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-success-dark)">2xx</text>
    <text x="65" y="76" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Erfolg</text>
    <text x="65" y="106" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-800)">Hat geklappt.</text>
    <text x="65" y="134" textAnchor="middle" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">200 · 201 · 204</text>
  </g>

  <g transform="translate(294,14)">
    <rect width="130" height="152" rx="11" fill="var(--ifm-color-info)" opacity="0.18"/>
    <rect width="130" height="152" rx="11" fill="none" stroke="var(--ifm-color-info-dark)" strokeWidth="1.8"/>
    <text x="65" y="46" textAnchor="middle" fontSize="26" fontWeight="800" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-info-dark)">3xx</text>
    <text x="65" y="76" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Umleitung</text>
    <text x="65" y="106" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-800)">Schau woanders</text>
    <text x="65" y="122" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-800)">nach.</text>
  </g>

  <g transform="translate(434,14)">
    <rect width="130" height="152" rx="11" fill="var(--ifm-color-warning)" opacity="0.22"/>
    <rect width="130" height="152" rx="11" fill="none" stroke="var(--ifm-color-warning-dark)" strokeWidth="1.8"/>
    <text x="65" y="46" textAnchor="middle" fontSize="26" fontWeight="800" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-warning-dark)">4xx</text>
    <text x="65" y="76" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Client-Fehler</text>
    <text x="65" y="106" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Du hast Mist gebaut.</text>
    <text x="65" y="134" textAnchor="middle" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">400 · 404 · 405</text>
  </g>

  <g transform="translate(574,14)">
    <rect width="132" height="152" rx="11" fill="var(--ifm-color-danger)" opacity="0.18"/>
    <rect width="132" height="152" rx="11" fill="none" stroke="var(--ifm-color-danger-dark)" strokeWidth="1.8"/>
    <text x="66" y="46" textAnchor="middle" fontSize="26" fontWeight="800" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-danger-dark)">5xx</text>
    <text x="66" y="76" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Server-Fehler</text>
    <text x="66" y="106" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Ich habe Mist gebaut.</text>
    <text x="66" y="134" textAnchor="middle" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">500</text>
  </g>

  {/* Die entscheidende Trennlinie */}
  <path d="M429 178 L429 206" stroke="var(--ifm-color-emphasis-500)" strokeWidth="2" strokeDasharray="6 5"/>
  <text x="220" y="198" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">alles in Ordnung</text>
  <text x="574" y="198" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">etwas ist schiefgegangen</text>
  <text x="360" y="232" textAnchor="middle" fontSize="12" fill="var(--ifm-color-emphasis-700)">Die wichtigste Frage im Fehlerfall: Liegt es an mir oder am Server?</text>
</svg>

| Gruppe | Bedeutung | Merkhilfe |
|---|---|---|
| **1xx** | Information | „Moment noch…" |
| **2xx** | Erfolg | „Hat geklappt." |
| **3xx** | Umleitung | „Schau woanders nach." |
| **4xx** | Fehler beim **Client** | „**Du** hast Mist gebaut." |
| **5xx** | Fehler beim **Server** | „**Ich** habe Mist gebaut." |

:::warning Die wichtigste Unterscheidung
**4xx heißt: Es lag an der Anfrage** — falsche Adresse, fehlende Daten, keine Berechtigung. Dieselbe Anfrage unverändert zu wiederholen hilft meist nicht.

„Meist", weil der genaue Code entscheidet: Nach einer Anmeldung verschwindet ein `401`, nach dem Ablauf einer Sperre ein `429`, und ein `404` kann sich in ein `200` verwandeln, sobald jemand den Datensatz anlegt.

**5xx heißt: Der Server ist schuld.** Dieselbe Anfrage kann gleich schon funktionieren.
:::

### Die Codes, die du brauchst

| Code | Text | Wann |
|---|---|---|
| `200` | OK | Anfrage erfolgreich, Antwort enthält Daten |
| `201` | Created | Ressource wurde angelegt. Sollte im `Location`-Header die Adresse der neuen Ressource mitschicken |
| `204` | No Content | Erfolgreich, aber es gibt nichts zurückzugeben — typisch nach `DELETE` |
| `400` | Bad Request | Die Anfrage ist fehlerhaft aufgebaut |
| `401` | Unauthorized | Nicht angemeldet. *(Der Name ist irreführend — es geht um Authentifizierung.)* |
| `403` | Forbidden | Angemeldet, aber nicht berechtigt |
| `404` | Not Found | Die angeforderte Ressource gibt es nicht |
| `405` | Method Not Allowed | Ressource existiert, aber nicht mit dieser Methode |
| `406` | Not Acceptable | Der Server kann kein Format liefern, das der Client im `Accept`-Header verlangt |
| `409` | Conflict | Widerspruch zum aktuellen Zustand, z. B. E-Mail schon vergeben |
| `415` | Unsupported Media Type | Der Server versteht das Format des mitgeschickten Bodys nicht |
| `500` | Internal Server Error | Unerwarteter Fehler im Server |

:::danger Häufiger Fehler
Ein Server, der bei einem nicht gefundenen Datensatz `200 OK` mit dem Inhalt `null` zurückgibt.

Der Client muss dann **raten**, ob alles gut ging. Genau dafür gibt es `404`.
:::

## Wichtige Header

| Header | Richtung | Bedeutung |
|---|---|---|
| `Content-Type` | beide | In welchem Format ist der **Body** dieser Nachricht? |
| `Accept` | Anfrage | In welchem Format hätte ich die **Antwort** gern? |
| `Authorization` | Anfrage | Anmeldedaten, meist ein Token |
| `Location` | Antwort | Adresse der neu angelegten Ressource (bei `201`) |

:::tip Content-Type und Accept verwechselt man leicht
`Content-Type` beschreibt, **was ich mitschicke**.
`Accept` beschreibt, **was ich zurückhaben will**.

Bei einem `POST` stehen oft beide in der Anfrage: „Ich schicke JSON *und* möchte JSON zurück."
:::

## Content Negotiation: mehrere Formate

`Content-Type` und `Accept` sind kein Selbstzweck. Über sie handeln Client und Server aus, in welchem Format die Daten übertragen werden. Dieses Aushandeln heißt **Content Negotiation** (Inhaltsverhandlung).

Solange eine API nur JSON kennt, gibt es nichts zu verhandeln. Interessant wird es, sobald ein Endpunkt **mehrere** Formate bedienen kann — etwa JSON für die App, CSV für den Export in die Tabellenkalkulation und XML für einen älteren Partnerdienst:

<svg viewBox="0 0 720 330" width="100%" role="img"
     aria-label="Drei Clients verlangen über den Accept-Header drei verschiedene Formate vom selben Endpunkt"
     fontFamily="var(--ifm-font-family-base)">

  {/* Clients links */}
  <g transform="translate(14,14)">
    <rect width="196" height="70" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <text x="16" y="26" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">App</text>
    <text x="16" y="50" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">Accept: application/json</text>
  </g>
  <g transform="translate(14,128)">
    <rect width="196" height="70" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <text x="16" y="26" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Excel-Export</text>
    <text x="16" y="50" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">Accept: text/csv</text>
  </g>
  <g transform="translate(14,242)">
    <rect width="196" height="70" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <text x="16" y="26" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Partnerdienst</text>
    <text x="16" y="50" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">Accept: application/xml</text>
  </g>

  <path d="M212 49 C250 49 252 148 288 148" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <path d="M212 163 L288 163" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <path d="M212 277 C250 277 252 178 288 178" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>

  {/* ein Endpunkt */}
  <g transform="translate(292,118)">
    <rect width="136" height="90" rx="12" fill="var(--ifm-color-primary)" opacity="0.14"/>
    <rect width="136" height="90" rx="12" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2.2"/>
    <text x="68" y="30" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-font-color-base)">ein einziger</text>
    <text x="68" y="48" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-font-color-base)">Endpunkt</text>
    <text x="68" y="72" textAnchor="middle" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-primary)">GET /persons</text>
  </g>

  <path d="M432 148 C468 148 470 49 506 49" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.8"/>
  <path d="M432 163 L506 163" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.8"/>
  <path d="M432 178 C468 178 470 277 506 277" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.8"/>
  <path d="M499 44 L508 49 L499 54" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.8"/>
  <path d="M499 158 L508 163 L499 168" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.8"/>
  <path d="M499 272 L508 277 L499 282" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.8"/>

  {/* Formate rechts */}
  <g transform="translate(512,20)">
    <rect width="194" height="58" rx="10" fill="var(--ifm-background-color)" stroke="var(--ifm-color-primary)" strokeWidth="1.6"/>
    <text x="18" y="26" fontSize="14" fontWeight="700" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-primary)">JSON</text>
    <text x="18" y="45" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">für Programme</text>
  </g>
  <g transform="translate(512,134)">
    <rect width="194" height="58" rx="10" fill="var(--ifm-background-color)" stroke="var(--ifm-color-primary)" strokeWidth="1.6"/>
    <text x="18" y="26" fontSize="14" fontWeight="700" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-primary)">CSV</text>
    <text x="18" y="45" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">für Tabellenkalkulation</text>
  </g>
  <g transform="translate(512,248)">
    <rect width="194" height="58" rx="10" fill="var(--ifm-background-color)" stroke="var(--ifm-color-primary)" strokeWidth="1.6"/>
    <text x="18" y="26" fontSize="14" fontWeight="700" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-primary)">XML</text>
    <text x="18" y="45" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">für ältere Systeme</text>
  </g>
</svg>

Dieselbe Ressource, dieselbe URL — das Format bestimmt der Client über den `Accept`-Header. In Spring gibt man die möglichen Formate am Endpunkt an:

```java
@GetMapping(value = "/{id}",
            produces = { MediaType.APPLICATION_JSON_VALUE,
                         MediaType.APPLICATION_XML_VALUE })
public Person getPersonById(@PathVariable Long id) { ... }
```

Für die Gegenrichtung — welche Formate der Endpunkt *annimmt* — gibt es `consumes`:

```java
@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
```

### Was passiert, wenn das Format nicht passt?

Zwei Statuscodes gehören genau hierher, und sie sind leicht zu verwechseln:

| Code | Wer hat das falsche Format? | Auslöser |
|---|---|---|
| `415` Unsupported Media Type | Der **Client** schickt etwas, das der Server nicht lesen kann | `Content-Type: text/plain` bei einem JSON-Endpunkt |
| `406` Not Acceptable | Der **Server** kann nicht liefern, was der Client verlangt | `Accept: application/xml` bei einem JSON-Endpunkt |

Merkhilfe: `415` betrifft die **Hinfahrt** (den Request-Body), `406` die **Rückfahrt** (die Antwort).

:::tip Probiere es aus
Beide Codes kannst du an deiner eigenen Anwendung auslösen, ohne eine Zeile zu ändern:

```bash
# 415 – falsches Format geschickt
curl -i -X POST http://localhost:8080/api/v1/persons \
     -H "Content-Type: text/plain" -d "abc"

# 406 – unmögliches Format verlangt
curl -i -H "Accept: application/xml" http://localhost:8080/api/v1/persons/1
```

Interessant dabei: Deine Endpunkte tragen **kein** `consumes` und **kein** `produces` — und liefern die richtigen Codes trotzdem. Spring erzwingt den Vertrag also schon von sich aus, weil JSON das einzige eingerichtete Format ist.

Genau deshalb sind die beiden Angaben im Normalfall verzichtbar. Sie werden erst nötig, wenn es wirklich mehr als ein Format gibt.
:::

## Fehlerantworten nach RFC 9457

Für Fehler gibt es ein standardisiertes Antwortformat namens *Problem Details*. Es ist am Content-Type `application/problem+json` erkennbar:

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Keine Person mit der Id 99",
  "instance": "/api/v1/persons/99"
}
```

| Feld | Bedeutung |
|---|---|
| `type` | URI, die den Fehlertyp beschreibt |
| `title` | Kurze, allgemeine Bezeichnung |
| `status` | Der HTTP-Statuscode, noch einmal im Rumpf |
| `detail` | Die konkrete, auf diesen Fall bezogene Meldung |
| `instance` | Welche Anfrage den Fehler ausgelöst hat |

Der Vorteil gegenüber einer selbst erfundenen Struktur: Andere Programme und Werkzeuge kennen dieses Format bereits.

## HTTP sichtbar machen

| Werkzeug | Wofür |
|---|---|
| **Browser-Adresszeile** | Nur `GET`. Schnellster Weg für einen Blick |
| **Entwicklerwerkzeuge** (F12), Reiter *Netzwerk* | Zeigt zu jeder Anfrage Methode, Status, Header und Body |
| **`.http`-Datei in der IDE** | Requests als Textdatei speichern und ausführen — versionierbar |
| **Postman** | Eigenständiges grafisches Werkzeug, in Betrieben verbreitet. Sammelt Anfragen in „Collections". In diesen Tutorials nicht nötig — was es kann, decken die `.http`-Datei und die Swagger-Oberfläche ab. Wenn es dir im Betrieb begegnet: Es ist dasselbe HTTP darunter. |
| **`curl`** | Kommandozeile, überall vorhanden, gut für Skripte |

Dieselbe Anfrage in drei Werkzeugen:

```http
### .http-Datei
POST http://localhost:8080/api/v1/persons
Content-Type: application/json

{"firstname":"Anna","surname":"Schmidt"}
```

```bash
# curl
curl -X POST http://localhost:8080/api/v1/persons \
     -H "Content-Type: application/json" \
     -d '{"firstname":"Anna","surname":"Schmidt"}'
```

:::note Das hast du gelernt
- Eine HTTP-Nachricht besteht aus **Startzeile, Headern, Leerzeile und Body**.
- Die **Methode** sagt, was passieren soll; der **Pfad**, womit.
- Die erste Ziffer des Statuscodes trennt **4xx (Client schuld)** von **5xx (Server schuld)**.
- `Content-Type` beschreibt das Mitgeschickte, `Accept` das Gewünschte.
- Über diese beiden Header handeln Client und Server das Format aus (**Content Negotiation**). `415` meint ein unlesbares Format auf der Hinfahrt, `406` ein unmögliches auf der Rückfahrt.
- Fehler werden standardisiert als **Problem Details** (`application/problem+json`) zurückgegeben.
:::
