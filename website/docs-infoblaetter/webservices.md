---
id: webservices
title: Was ist ein Webservice?
sidebar_label: Webservices
sidebar_position: 1
---

# Was ist ein Webservice?

## Die Ausgangslage: Programme müssen miteinander reden

Du kennst Programme, die ein Mensch bedient: Eine Oberfläche mit Knöpfen, Feldern und Listen. Der Mensch klickt, das Programm reagiert.

Sehr viel häufiger ist aber ein anderer Fall: **Ein Programm braucht etwas von einem anderen Programm.** Niemand sitzt davor, niemand klickt.

Ein paar Beispiele aus dem Alltag:

| Situation | Wer fragt? | Wen fragt er? |
|---|---|---|
| Eine Wetter-App zeigt die Vorhersage für Bremen | die App auf dem Handy | den Server des Wetterdienstes |
| Ein Onlineshop prüft, ob die Kreditkarte gedeckt ist | der Shop-Server | den Server des Zahlungsdienstleisters |
| Die Schulverwaltung übernimmt Noten ins Zeugnisprogramm | das Zeugnisprogramm | den Server der Schulverwaltung |
| Eine Paketverfolgung zeigt „Sendung in Zustellung" | die Website des Versenders | den Server von DHL |

In keinem dieser Fälle öffnet ein Mensch eine Webseite beim anderen Anbieter und tippt etwas ab. Die Programme reden **direkt miteinander**.

Genau dafür gibt es Webservices.

:::info Definition
Ein **Webservice** ist ein Programm, das seine Funktionen über ein Netzwerk anderen Programmen zur Verfügung stellt — nicht Menschen.
:::

## Der Unterschied zu einer Webseite

Beides läuft über dasselbe Protokoll (HTTP) und oft über denselben Server. Der Unterschied liegt darin, **wer die Antwort lesen soll**.

<svg viewBox="0 0 720 430" width="100%" role="img"
     aria-label="Webseite liefert gestaltetes HTML für Menschen, Webservice liefert JSON für Programme"
     fontFamily="var(--ifm-font-family-base)">

  {/* ================= links: Webseite ================= */}
  <text x="170" y="22" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--ifm-font-color-base)">Webseite</text>
  <rect x="14" y="36" width="312" height="382" rx="14" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>

  <text x="170" y="64" textAnchor="middle" fontSize="12.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">GET /personen</text>
  <path d="M170 74 L170 92" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M165 86 L170 94 L175 86" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>

  {/* Browserfenster mit gestaltetem Inhalt */}
  <g transform="translate(34,100)">
    <rect width="272" height="176" rx="8" fill="var(--ifm-background-color)" stroke="var(--ifm-color-emphasis-400)" strokeWidth="1.5"/>
    <path d="M0 24 L272 24" stroke="var(--ifm-color-emphasis-400)" strokeWidth="1.5"/>
    <circle cx="16" cy="12" r="4" fill="var(--ifm-color-emphasis-400)"/>
    <circle cx="30" cy="12" r="4" fill="var(--ifm-color-emphasis-400)"/>
    <circle cx="44" cy="12" r="4" fill="var(--ifm-color-emphasis-400)"/>
    <rect x="18" y="40" width="130" height="15" rx="3" fill="var(--ifm-color-emphasis-800)"/>
    <rect x="18" y="66" width="200" height="8" rx="4" fill="var(--ifm-color-emphasis-400)"/>
    <rect x="18" y="82" width="164" height="8" rx="4" fill="var(--ifm-color-emphasis-400)"/>
    <rect x="18" y="106" width="236" height="24" rx="3" fill="var(--ifm-color-emphasis-200)"/>
    <rect x="18" y="130" width="236" height="24" rx="3" fill="none" stroke="var(--ifm-color-emphasis-300)"/>
    <path d="M96 106 L96 154 M175 106 L175 154" stroke="var(--ifm-color-emphasis-300)"/>
  </g>
  <text x="170" y="296" textAnchor="middle" fontSize="12" fill="var(--ifm-color-emphasis-700)">HTML — Überschriften, Tabellen, Farben</text>

  <path d="M170 308 L170 326" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M165 320 L170 328 L175 320" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>

  {/* Mensch */}
  <g transform="translate(34,338)">
    <rect width="272" height="64" rx="10" fill="var(--ifm-background-color)" stroke="var(--ifm-color-emphasis-300)"/>
    <g transform="translate(24,16)" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2" fill="none">
      <circle cx="12" cy="8" r="7"/>
      <path d="M0 32 C0 21 24 21 24 32" strokeLinecap="round"/>
    </g>
    <text x="72" y="30" fontSize="14" fontWeight="700" fill="var(--ifm-font-color-base)">Ein Mensch liest</text>
    <text x="72" y="48" fontSize="12" fill="var(--ifm-color-emphasis-700)">und versteht die Darstellung</text>
  </g>

  {/* ================= rechts: Webservice ================= */}
  <text x="550" y="22" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--ifm-color-primary)">Webservice</text>
  <rect x="394" y="36" width="312" height="382" rx="14" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-primary)" strokeWidth="1.5"/>

  <text x="550" y="64" textAnchor="middle" fontSize="12.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-primary)">GET /api/v1/persons</text>
  <path d="M550 74 L550 92" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <path d="M545 86 L550 94 L555 86" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>

  {/* reine Daten */}
  <g transform="translate(414,100)">
    <rect width="272" height="176" rx="8" fill="var(--ifm-background-color)" stroke="var(--ifm-color-primary)" strokeWidth="1.5"/>
    <text x="18" y="34" fontSize="12" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'['}</text>
    <text x="30" y="56" fontSize="12" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'{ "id": 1,'}</text>
    <text x="42" y="76" fontSize="12" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'"firstname": "Anna",'}</text>
    <text x="42" y="96" fontSize="12" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'"surname": "Schmidt" },'}</text>
    <text x="30" y="118" fontSize="12" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'{ "id": 2,'}</text>
    <text x="42" y="138" fontSize="12" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'"firstname": "Ben", ... }'}</text>
    <text x="18" y="160" fontSize="12" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{']'}</text>
  </g>
  <text x="550" y="296" textAnchor="middle" fontSize="12" fill="var(--ifm-color-emphasis-700)">JSON — nur die reinen Daten</text>

  <path d="M550 308 L550 326" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <path d="M545 320 L550 328 L555 320" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>

  {/* Programm */}
  <g transform="translate(414,338)">
    <rect width="272" height="64" rx="10" fill="var(--ifm-background-color)" stroke="var(--ifm-color-primary)"/>
    <g transform="translate(24,18)" stroke="var(--ifm-color-primary)" strokeWidth="2" fill="none">
      <rect x="0" y="0" width="28" height="22" rx="3"/>
      <path d="M8 8 L12 11 L8 14 M15 15 L21 15" strokeLinecap="round"/>
    </g>
    <text x="72" y="30" fontSize="14" fontWeight="700" fill="var(--ifm-font-color-base)">Ein Programm verarbeitet</text>
    <text x="72" y="48" fontSize="12" fill="var(--ifm-color-emphasis-700)">und rechnet mit den Werten weiter</text>
  </g>
</svg>

Dieselbe Information, zwei Verpackungen:

**Als Webseite (HTML)** — für Menschen gedacht, enthält Darstellungsanweisungen:

```html
<div class="person-karte">
  <h2>Anna Schmidt</h2>
  <p class="hinweis">Kundennummer: <strong>1</strong></p>
</div>
```

**Als Webservice-Antwort (JSON)** — für Programme gedacht, enthält nur Daten:

```json
{ "id": 1, "firstname": "Anna", "surname": "Schmidt" }
```

:::tip Der Kern des Unterschieds
HTML sagt, **wie etwas aussehen soll**. JSON sagt, **was es ist**.

Ein Programm interessiert sich nicht für Schriftgrößen. Es will wissen: Wie heißt das Feld, und was steht drin?
:::

## Warum baut man das überhaupt?

Man könnte ja auch die Datenbank direkt freigeben. Warum der Umweg über einen Webservice?

**1. Die Datenbank bleibt geschützt.**
Der Webservice entscheidet, wer was sehen und ändern darf. Eine direkt erreichbare Datenbank hätte diesen Wächter nicht.

**2. Die Innereien bleiben austauschbar.**
Wenn hinter dem Webservice die Datenbank gewechselt wird, merken die aufrufenden Programme davon nichts — solange die Schnittstelle gleich bleibt.

**3. Viele verschiedene Clients, eine Quelle.**
Webseite, Android-App, iPhone-App, Kassensystem und Partnerfirma greifen auf **denselben** Webservice zu. Die Fachlogik existiert genau einmal.

<svg viewBox="0 0 720 400" width="100%" role="img"
     aria-label="Fünf verschiedene Clients greifen auf denselben Webservice zu"
     fontFamily="var(--ifm-font-family-base)">

  {/* fünf Clients in einer Reihe */}
  <g transform="translate(20,20)">
    <rect width="126" height="76" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <g transform="translate(51,14)" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2" fill="none">
      <rect x="0" y="0" width="24" height="18" rx="2"/>
      <path d="M0 6 L24 6"/>
    </g>
    <text x="63" y="58" textAnchor="middle" fontSize="12" fill="var(--ifm-font-color-base)">Webseite</text>
  </g>

  <g transform="translate(158,20)">
    <rect width="126" height="76" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <g transform="translate(55,12)" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2" fill="none">
      <rect x="0" y="0" width="16" height="24" rx="3"/>
      <path d="M6 20 L10 20" strokeLinecap="round"/>
    </g>
    <text x="63" y="58" textAnchor="middle" fontSize="12" fill="var(--ifm-font-color-base)">Android-App</text>
  </g>

  <g transform="translate(296,20)">
    <rect width="126" height="76" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <g transform="translate(55,12)" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2" fill="none">
      <rect x="0" y="0" width="16" height="24" rx="3"/>
      <path d="M6 20 L10 20" strokeLinecap="round"/>
    </g>
    <text x="63" y="58" textAnchor="middle" fontSize="12" fill="var(--ifm-font-color-base)">iPhone-App</text>
  </g>

  <g transform="translate(434,20)">
    <rect width="126" height="76" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <g transform="translate(51,12)" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2" fill="none">
      <rect x="0" y="0" width="24" height="16" rx="2"/>
      <rect x="4" y="18" width="16" height="7" rx="1"/>
    </g>
    <text x="63" y="58" textAnchor="middle" fontSize="12" fill="var(--ifm-font-color-base)">Kassensystem</text>
  </g>

  <g transform="translate(572,20)">
    <rect width="126" height="76" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <g transform="translate(51,12)" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2" fill="none">
      <path d="M0 25 L0 8 L10 2 L20 8 L20 25"/>
      <path d="M7 25 L7 16 L13 16 L13 25"/>
    </g>
    <text x="63" y="58" textAnchor="middle" fontSize="12" fill="var(--ifm-font-color-base)">Partnerfirma</text>
  </g>

  {/* Bündelung */}
  <path d="M83 100 C83 130 360 120 360 152" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <path d="M221 100 C221 130 360 124 360 152" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <path d="M359 100 L359 152" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <path d="M497 100 C497 130 360 124 360 152" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <path d="M635 100 C635 130 360 120 360 152" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <path d="M354 146 L360 156 L366 146" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="2"/>

  {/* Webservice */}
  <g transform="translate(180,162)">
    <rect width="360" height="86" rx="13" fill="var(--ifm-color-primary)" opacity="0.12"/>
    <rect width="360" height="86" rx="13" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
    <g transform="translate(30,26)" stroke="var(--ifm-color-primary)" strokeWidth="2" fill="none">
      <rect x="0" y="0" width="30" height="34" rx="3"/>
      <path d="M8 9 L22 9 M8 17 L22 17 M8 25 L16 25" strokeLinecap="round"/>
    </g>
    <text x="80" y="36" fontSize="16" fontWeight="700" fill="var(--ifm-font-color-base)">Webservice</text>
    <text x="80" y="58" fontSize="12.5" fill="var(--ifm-color-emphasis-800)">die Fachlogik — genau einmal vorhanden</text>
  </g>

  <path d="M360 250 L360 288" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M355 282 L360 290 L365 282" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>

  {/* Datenbank */}
  <g transform="translate(290,294)">
    <path d="M0 13 C0 6 32 0 70 0 C108 0 140 6 140 13 L140 62 C140 69 108 75 70 75 C32 75 0 69 0 62 Z"
          fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
    <path d="M0 13 C0 20 32 26 70 26 C108 26 140 20 140 13" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
    <text x="70" y="52" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--ifm-font-color-base)">Datenbank</text>
  </g>

  <text x="360" y="392" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Eine Änderung an der Fachlogik wirkt sofort für alle fünf</text>
</svg>

**4. Man kann sich Arbeit sparen.**
Kaum jemand baut seine eigene Kartendarstellung, Adressprüfung oder Bezahlabwicklung. Man ruft einen fremden Webservice auf.

## Fachbegriffe, die dir begegnen werden

| Begriff | Bedeutung |
|---|---|
| **API** | *Application Programming Interface*, deutsch: Programmierschnittstelle. Die Menge aller Funktionen, die ein Programm nach außen anbietet. Jeder Webservice ist eine API — aber nicht jede API ist ein Webservice (auch eine Java-Bibliothek hat eine API). |
| **Client** | Das Programm, das **fragt**. |
| **Server** | Das Programm, das **antwortet**. |
| **Endpunkt** | Eine einzelne aufrufbare Adresse des Webservice, z. B. `/api/v1/persons/1`. |
| **Request** | Die Anfrage des Clients. |
| **Response** | Die Antwort des Servers. |
| **Backend** | Der Teil einer Anwendung, der im Hintergrund läuft und keine Oberfläche hat — meist genau der Webservice. |
| **Frontend** | Der Teil, den der Nutzer sieht und bedient. |

:::warning Client und Server sind Rollen, keine Geräte
Derselbe Rechner kann in einer Anfrage Client und in der nächsten Server sein. Ein Onlineshop ist **Server** gegenüber dem Browser des Kunden und gleichzeitig **Client** gegenüber dem Zahlungsdienstleister.
:::

## Wie sieht so ein Aufruf konkret aus?

Ein Webservice-Aufruf besteht immer aus zwei Nachrichten: Anfrage hin, Antwort zurück.

<svg viewBox="0 0 720 340" width="100%" role="img"
     aria-label="Ablauf eines Aufrufs zwischen Client, Webservice und Datenbank in vier Schritten"
     fontFamily="var(--ifm-font-family-base)">

  {/* Spaltenköpfe */}
  <g transform="translate(20,10)">
    <rect width="150" height="48" rx="9" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <text x="75" y="21" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="var(--ifm-font-color-base)">Client</text>
    <text x="75" y="38" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-700)">z. B. Handy-App</text>
  </g>
  <g transform="translate(285,10)">
    <rect width="150" height="48" rx="9" fill="var(--ifm-color-primary)" opacity="0.12"/>
    <rect width="150" height="48" rx="9" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.8"/>
    <text x="75" y="21" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="var(--ifm-font-color-base)">Webservice</text>
    <text x="75" y="38" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-700)">dein Programm</text>
  </g>
  <g transform="translate(550,10)">
    <rect width="150" height="48" rx="9" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <text x="75" y="30" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="var(--ifm-font-color-base)">Datenbank</text>
  </g>

  {/* Lebenslinien */}
  <path d="M95 58 L95 320" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.6" strokeDasharray="5 5"/>
  <path d="M360 58 L360 320" stroke="var(--ifm-color-primary)" strokeWidth="1.6" strokeDasharray="5 5" opacity="0.55"/>
  <path d="M625 58 L625 320" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.6" strokeDasharray="5 5"/>

  {/* Schritt 1 */}
  <circle cx="95" cy="96" r="12" fill="var(--ifm-color-primary)"/>
  <text x="95" y="101" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">1</text>
  <path d="M110 96 L346 96" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <path d="M339 91 L348 96 L339 101" fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <text x="228" y="86" textAnchor="middle" fontSize="12" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">GET /api/v1/persons/1</text>

  {/* Schritt 2 */}
  <circle cx="360" cy="152" r="12" fill="var(--ifm-color-primary)"/>
  <text x="360" y="157" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">2</text>
  <path d="M375 152 L611 152" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <path d="M604 147 L613 152 L604 157" fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <text x="493" y="142" textAnchor="middle" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'SELECT ... WHERE id = 1'}</text>

  {/* Schritt 3 */}
  <circle cx="625" cy="212" r="12" fill="var(--ifm-color-emphasis-600)"/>
  <text x="625" y="217" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">3</text>
  <path d="M610 212 L374 212" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2" strokeDasharray="6 4"/>
  <path d="M381 207 L372 212 L381 217" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <text x="493" y="202" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-700)">eine Zeile aus der Tabelle</text>

  {/* Schritt 4 */}
  <circle cx="360" cy="278" r="12" fill="var(--ifm-color-primary)"/>
  <text x="360" y="283" textAnchor="middle" fontSize="12" fontWeight="700" fill="#ffffff">4</text>
  <path d="M345 278 L109 278" stroke="var(--ifm-color-primary)" strokeWidth="2" strokeDasharray="6 4"/>
  <path d="M116 273 L107 278 L116 283" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <text x="228" y="268" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ifm-color-primary)">200 OK</text>
  <text x="228" y="298" textAnchor="middle" fontSize="11" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">{'{"id":1,"firstname":"Anna", ...}'}</text>
</svg>

Die Anfrage im Klartext:

```http
GET /api/v1/persons/1 HTTP/1.1
Host: localhost:8080
Accept: application/json
```

Die Antwort:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"id":1,"firstname":"Anna","surname":"Schmidt"}
```

Mehr zum Aufbau dieser Nachrichten steht im Infoblatt [HTTP kompakt](/infoblaetter/http-kompakt).

## Zwei Baustile für Webservices

Webservice sagt noch nichts darüber, **wie** die Nachrichten aufgebaut sind. Dafür gibt es verschiedene Baustile. Die beiden wichtigsten:

- **REST** — der heute vorherrschende Stil für Web- und Mobil-APIs. Damit arbeitest du in diesen Tutorials.
- **SOAP** — der ältere, streng geregelte Standard. In Banken, Versicherungen und Behörden noch weit verbreitet.

Beide werden im Infoblatt [Das REST-Paradigma](/infoblaetter/rest-paradigma) gegenübergestellt.

:::note Das hast du gelernt
- Ein Webservice stellt Funktionen **für andere Programme** bereit, nicht für Menschen.
- Er liefert **Daten** (meist JSON) statt **Darstellung** (HTML).
- Er schützt die Datenbank, entkoppelt die Innereien und bedient viele Clients aus einer Quelle.
- Client und Server sind **Rollen** in einem Aufruf, keine Gerätetypen.
:::
