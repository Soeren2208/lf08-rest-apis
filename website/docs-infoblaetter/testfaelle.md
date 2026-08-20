---
id: testfaelle
title: Testfälle formulieren
sidebar_label: Testfälle formulieren
sidebar_position: 7
---

# Testfälle formulieren

## Warum aufschreiben, was man ohnehin ausprobiert?

Beim Entwickeln probiert man ständig etwas aus: Endpunkt aufrufen, Ergebnis ansehen, weitermachen. Das fühlt sich nach Testen an — ist aber keines.

Was dabei fehlt:

- **Nachvollziehbarkeit.** In drei Wochen weißt du nicht mehr, was du geprüft hast.
- **Vollständigkeit.** Man probiert, was einem gerade einfällt. Meist nur der Fall, der funktioniert.
- **Übertragbarkeit.** Jemand anderes kann dein Ergebnis nicht wiederholen.

:::danger Der häufigste Fehler beim Testen
Man testet nur den **Gutfall** — die Eingabe, die funktionieren soll.

Fehler stecken aber fast immer in den anderen Fällen: leere Eingabe, unbekannte Id, doppelter Aufruf, falsches Format. Genau die probiert niemand freiwillig aus.
:::

## Der Aufbau eines Testfalls

Ein Testfall hat vier Bestandteile. Fehlt einer, ist er nicht überprüfbar.

| Bestandteil | Frage | Beispiel |
|---|---|---|
| **Bezeichnung** | Was wird geprüft? | „Unbekannte Id liefert 404" |
| **Vorbedingung** | Welcher Zustand muss vorher herrschen? | „Anwendung läuft, es gibt keine Person mit Id 99" |
| **Testschritte** | Was genau wird getan? | „GET auf `/api/v1/persons/99`" |
| **Erwartetes Ergebnis** | Was muss dabei herauskommen? | „Status 404, Rumpf enthält `detail`" |

:::warning Das erwartete Ergebnis wird **vorher** festgelegt
Wer erst ausführt und dann aufschreibt, was herauskam, hat nichts geprüft — er hat protokolliert.

Der Testfall entscheidet vorher, was richtig ist. Erst dadurch kann er überhaupt fehlschlagen.
:::

### Gut und schlecht formuliert

| ❌ Schlecht | ✅ Gut | Warum |
|---|---|---|
| „Endpunkt testen" | „GET auf `/api/v1/persons/1` liefert Status 200 und `firstname` = `Anna`" | prüfbar statt vage |
| „Es kommt was Sinnvolles" | „Status 404, Feld `detail` enthält die Id" | nachprüfbar |
| „Person anlegen klappt" | „POST liefert 201, Antwort enthält ein Feld `id`" | benennt das Kriterium |
| „Fehler wird angezeigt" | „Status 400, **nicht** 500" | grenzt ab |

:::tip Formuliere auch, was **nicht** passieren darf
„Status 400, nicht 500" ist stärker als „Status 400". Es schließt eine typische Verwechslung ausdrücklich aus.

Genauso: „Es wird **keine** neue Person angelegt."
:::

## Testfälle systematisch finden

Nicht raten — es gibt zwei Verfahren, die du aus dem ersten Lehrjahr kennst.

### Äquivalenzklassen

Teile alle möglichen Eingaben in Gruppen, die sich **gleich verhalten**. Aus jeder Gruppe genügt ein Vertreter.

Beispiel: Ein Endpunkt `GET /api/v1/persons/{id}`.

| Klasse | Beispielwert | Erwartung |
|---|---|---|
| gültige, vorhandene Id | `1` | 200 mit Daten |
| gültige, nicht vorhandene Id | `99` | 404 |
| keine Zahl | `abc` | 400 |
| negative Zahl | `-1` | 404 oder 400 |

Vier Testfälle statt tausend Einzelwerte — und die Abdeckung ist besser als bei zufälligem Probieren.

### Grenzwertanalyse

Fehler sitzen an den **Rändern** der Klassen, nicht in ihrer Mitte. Wenn ein Kommentar zwischen 5 und 500 Zeichen lang sein darf, prüfst du:

<svg viewBox="0 0 720 210" width="100%" role="img"
     aria-label="Zahlenstrahl mit den vier Grenzwerten 4, 5, 500 und 501"
     fontFamily="var(--ifm-font-family-base)">

  {/* Bereiche */}
  <rect x="16" y="70" width="150" height="44" fill="var(--ifm-color-danger)" opacity="0.15"/>
  <rect x="166" y="70" width="388" height="44" fill="var(--ifm-color-success)" opacity="0.18"/>
  <rect x="554" y="70" width="150" height="44" fill="var(--ifm-color-danger)" opacity="0.15"/>

  <text x="91" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-color-danger-dark)">zu kurz</text>
  <text x="360" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-color-success-dark)">gültig — 5 bis 500 Zeichen</text>
  <text x="629" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-color-danger-dark)">zu lang</text>

  {/* Zahlenstrahl */}
  <path d="M16 130 L704 130" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M697 125 L706 130 L697 135" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>

  {/* Grenzmarkierungen */}
  <path d="M166 62 L166 122" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <path d="M554 62 L554 122" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>

  {/* die vier Pruefwerte */}
  <g transform="translate(140,130)">
    <circle cx="0" cy="0" r="9" fill="var(--ifm-color-danger)"/>
    <text x="0" y="30" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ifm-color-danger-dark)">4</text>
    <text x="0" y="50" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">knapp darunter</text>
  </g>
  <g transform="translate(192,130)">
    <circle cx="0" cy="0" r="9" fill="var(--ifm-color-success-dark)"/>
    <text x="0" y="30" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ifm-color-success-dark)">5</text>
    <text x="0" y="50" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">auf der Grenze</text>
  </g>
  <g transform="translate(528,130)">
    <circle cx="0" cy="0" r="9" fill="var(--ifm-color-success-dark)"/>
    <text x="0" y="30" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ifm-color-success-dark)">500</text>
    <text x="0" y="50" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">auf der Grenze</text>
  </g>
  <g transform="translate(580,130)">
    <circle cx="0" cy="0" r="9" fill="var(--ifm-color-danger)"/>
    <text x="0" y="30" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ifm-color-danger-dark)">501</text>
    <text x="0" y="50" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">knapp darüber</text>
  </g>

  <text x="360" y="30" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Geprüft wird nicht die Mitte, sondern beidseitig jede Grenze</text>
  <text x="360" y="50" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-700)">Ein Wert wie 250 findet keinen einzigen typischen Fehler</text>
</svg>

Also genau vier Werte: `4`, `5`, `500`, `501` — jeweils direkt unter und auf der Grenze.

:::info Warum gerade die Ränder?
Weil dort die Vergleichsoperatoren sitzen. Ein `<` statt `<=` verschiebt die Grenze um genau eins — mit einem Wert aus der Mitte fällt das nie auf.
:::

## Was man bei einer REST-Schnittstelle prüft

Bei einem Webservice reicht es nicht, auf den Inhalt zu schauen. Zu jedem Aufruf gehören drei Ebenen:

<svg viewBox="0 0 720 340" width="100%" role="img"
     aria-label="Eine HTTP-Antwort wird auf drei Ebenen geprüft: Statuszeile, Header und Rumpf"
     fontFamily="var(--ifm-font-family-base)">

  {/* die Antwort als Dokument */}
  <g transform="translate(14,20)">
    <rect width="360" height="196" rx="10" fill="var(--ifm-background-color)" stroke="var(--ifm-color-emphasis-400)" strokeWidth="1.8"/>
    <text x="16" y="26" fontSize="11.5" fontWeight="700" fill="var(--ifm-color-emphasis-700)">Antwort des Servers</text>

    {/* Statuszeile */}
    <rect x="12" y="38" width="336" height="32" rx="6" fill="var(--ifm-color-success)" opacity="0.16"/>
    <text x="24" y="59" fontSize="12.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">HTTP/1.1 201 Created</text>

    {/* Header */}
    <rect x="12" y="76" width="336" height="54" rx="6" fill="var(--ifm-color-info)" opacity="0.16"/>
    <text x="24" y="96" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">Content-Type: application/json</text>
    <text x="24" y="118" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">Location: /api/v1/persons/1</text>

    {/* Rumpf */}
    <rect x="12" y="136" width="336" height="48" rx="6" fill="var(--ifm-color-primary)" opacity="0.14"/>
    <text x="24" y="166" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'{"id":1,"firstname":"Anna"}'}</text>
  </g>

  {/* Ebene 1 */}
  <path d="M378 74 L424 74" stroke="var(--ifm-color-success-dark)" strokeWidth="2"/>
  <path d="M417 69 L426 74 L417 79" fill="none" stroke="var(--ifm-color-success-dark)" strokeWidth="2"/>
  <g transform="translate(430,44)">
    <rect width="276" height="60" rx="9" fill="var(--ifm-color-success)" opacity="0.14"/>
    <rect width="276" height="60" rx="9" fill="none" stroke="var(--ifm-color-success-dark)" strokeWidth="1.6"/>
    <circle cx="26" cy="30" r="13" fill="var(--ifm-color-success-dark)"/>
    <text x="26" y="35" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#ffffff">1</text>
    <text x="50" y="26" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Statuscode</text>
    <text x="50" y="45" fontSize="11.5" fill="var(--ifm-color-emphasis-800)">201? 200? 404? Der richtige?</text>
  </g>

  {/* Ebene 2 */}
  <path d="M378 122 L424 138" stroke="var(--ifm-color-info-dark)" strokeWidth="2"/>
  <path d="M416 135 L426 139 L418 145" fill="none" stroke="var(--ifm-color-info-dark)" strokeWidth="2"/>
  <g transform="translate(430,116)">
    <rect width="276" height="60" rx="9" fill="var(--ifm-color-info)" opacity="0.14"/>
    <rect width="276" height="60" rx="9" fill="none" stroke="var(--ifm-color-info-dark)" strokeWidth="1.6"/>
    <circle cx="26" cy="30" r="13" fill="var(--ifm-color-info-dark)"/>
    <text x="26" y="35" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#ffffff">2</text>
    <text x="50" y="26" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Header</text>
    <text x="50" y="45" fontSize="11.5" fill="var(--ifm-color-emphasis-800)">Format richtig? Location gesetzt?</text>
  </g>

  {/* Ebene 3 */}
  <path d="M378 176 L424 210" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <path d="M415 206 L426 212 L419 218" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <g transform="translate(430,188)">
    <rect width="276" height="60" rx="9" fill="var(--ifm-color-primary)" opacity="0.14"/>
    <rect width="276" height="60" rx="9" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.6"/>
    <circle cx="26" cy="30" r="13" fill="var(--ifm-color-primary)"/>
    <text x="26" y="35" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#ffffff">3</text>
    <text x="50" y="26" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Rumpf</text>
    <text x="50" y="45" fontSize="11.5" fill="var(--ifm-color-emphasis-800)">Sind die Felder da? Stimmen die Werte?</text>
  </g>

  {/* Ebene 4 - die vergessene */}
  <g transform="translate(14,248)">
    <rect width="692" height="76" rx="10" fill="var(--ifm-color-warning)" opacity="0.16"/>
    <rect width="692" height="76" rx="10" fill="none" stroke="var(--ifm-color-warning-dark)" strokeWidth="1.8" strokeDasharray="7 5"/>
    <circle cx="40" cy="38" r="14" fill="var(--ifm-color-warning-dark)"/>
    <text x="40" y="43" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">4</text>
    <text x="68" y="32" fontSize="13.5" fontWeight="700" fill="var(--ifm-font-color-base)">Der Zustand danach — die Ebene, die am häufigsten vergessen wird</text>
    <text x="68" y="56" fontSize="11.5" fill="var(--ifm-color-emphasis-800)">Ist der Datensatz wirklich in der Datenbank? Eine 201 allein beweist das nicht.</text>
  </g>
</svg>

Dazu kommt eine vierte, die man leicht vergisst:

**4. Der Zustand danach.** Ist der Datensatz wirklich in der Datenbank gelandet? Ist er nach dem `DELETE` wirklich weg? Eine Antwort mit `201` beweist noch nicht, dass gespeichert wurde.

:::tip Deshalb bestehen viele Testfälle aus zwei Schritten
„`DELETE` auf `/persons/2`" **und** „danach `GET` auf `/persons/2`".

Der erste Schritt löst aus, der zweite prüft die Wirkung.
:::

## Eine Prüfliste für REST-Endpunkte

Geh diese Punkte für jeden Endpunkt durch:

| Frage | Typischer Testfall |
|---|---|
| Funktioniert der Normalfall? | Gültige Anfrage → erwarteter Statuscode und Inhalt |
| Was bei unbekannter Id? | → `404`, nicht `200` mit leerem Inhalt |
| Was bei fehlerhaftem JSON? | → `400`, nicht `500` |
| Was bei falscher HTTP-Methode? | → `405` |
| Was, wenn die Sammlung leer ist? | → `200` mit `[]`, nicht `404` |
| Was bei zweimaligem Aufruf? | Idempotenz prüfen |
| Ist die Wirkung eingetreten? | Nachfolgender Aufruf oder Blick in die Datenbank |

## Vom Testfall zum automatischen Test

Die Testfälle, die du von Hand ausführst, sind bereits der Bauplan für automatisierte Tests. Der Aufbau ist derselbe:

| Testfall auf dem Papier | Im Testcode |
|---|---|
| Vorbedingung | *Arrange* — Ausgangslage herstellen |
| Testschritte | *Act* — auslösen |
| Erwartetes Ergebnis | *Assert* — prüfen |

Dieses Muster heißt **Arrange–Act–Assert**. Ein handschriftlicher Testfall lässt sich fast Zeile für Zeile übersetzen — deshalb lohnt es sich, ihn ordentlich zu formulieren, auch wenn man ihn zunächst von Hand ausführt.

:::note Das hast du gelernt
- Ein Testfall braucht **Bezeichnung, Vorbedingung, Schritte und erwartetes Ergebnis**.
- Das erwartete Ergebnis wird **vor** der Ausführung festgelegt.
- **Äquivalenzklassen** reduzieren die Zahl der Fälle, **Grenzwertanalyse** findet die typischen Fehler.
- Bei REST prüft man **Statuscode, Header, Rumpf** — und den **Zustand danach**.
- Fehlerfälle sind wichtiger als der Gutfall, weil dort die Fehler sitzen.
- Ein guter Testfall lässt sich später fast unverändert in einen automatisierten Test übersetzen.
:::
