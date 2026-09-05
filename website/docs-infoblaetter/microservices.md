---
title: Microservices
sidebar_label: Microservices
sidebar_position: 16
---

# Microservices

## Womit alles anfängt: der Monolith

Ein **Monolith** ist eine Anwendung, die als **ein Stück** gebaut, ausgeliefert und gestartet wird. Eine `.jar`-Datei, eine Datenbank, ein Prozess.

Genau so sieht dein Gästebuch aus. Und dein Webshop. Und die allermeisten Anwendungen, die je geschrieben wurden.

:::info „Monolith" ist kein Schimpfwort
Der Begriff klingt nach Altlast, beschreibt aber nur eine Bauform — und meistens die richtige. Ein Monolith ist einfach zu bauen, einfach zu testen, einfach zu betreiben. Eine Datenbanktransaktion umspannt das ganze System. Ein Methodenaufruf kann nicht im Netzwerk verlorengehen.

Wer mit Microservices anfängt, weil sie moderner klingen, zahlt einen hohen Preis für ein Problem, das er noch gar nicht hat.
:::

## Wo der Monolith eng wird

Solange er klein ist, gar nicht. Die Probleme kommen mit der Größe und mit der Anzahl der Menschen, die daran arbeiten.

| Was passiert | Warum es beim Monolithen weh tut |
|---|---|
| **Ein Team wartet auf das andere** | Alle liefern gemeinsam aus. Wer fertig ist, wartet auf den, der es nicht ist |
| **Eine Änderung, alles neu testen** | Ein Fehler im Rechnungsdruck kann den Warenkorb betreffen — man weiß es nicht sicher |
| **Ein Absturz, alles weg** | Ein Speicherleck im Bildimport reißt die ganze Anwendung mit |
| **Eine Technologie für alles** | Die Bildverarbeitung wäre in einer anderen Sprache besser aufgehoben — geht aber nicht |
| **Skalieren nur im Ganzen** | Nur die Suche ist überlastet? Trotzdem wird alles vervielfacht |

Der letzte Punkt ist der greifbarste.

<svg viewBox="0 0 720 300" width="100%" role="img"
     aria-label="Beim Monolithen werden zum Skalieren alle Bestandteile vervielfacht, bei Microservices nur der überlastete Dienst"
     fontFamily="var(--ifm-font-family-base)">

  {/* ---------- Monolith ---------- */}
  <text x="176" y="20" textAnchor="middle" fontSize="14.5" fontWeight="700"
        fill="var(--ifm-font-color-base)">Monolith skalieren</text>
  <text x="176" y="40" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">nur die Suche ist überlastet</text>

  <g>
    <rect x="24" y="54" width="98" height="112" rx="8"
          fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
    <rect x="34" y="64" width="78" height="24" rx="4" fill="var(--ifm-color-warning-contrast-background)"/>
    <text x="73" y="81" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ifm-font-color-base)">Suche</text>
    <rect x="34" y="94" width="78" height="24" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="73" y="111" textAnchor="middle" fontSize="10.5" fill="var(--ifm-font-color-base)">Katalog</text>
    <rect x="34" y="124" width="78" height="24" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="73" y="141" textAnchor="middle" fontSize="10.5" fill="var(--ifm-font-color-base)">Versand</text>
  </g>

  <g opacity="0.75">
    <rect x="132" y="54" width="98" height="112" rx="8"
          fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
    <rect x="142" y="64" width="78" height="24" rx="4" fill="var(--ifm-color-warning-contrast-background)"/>
    <text x="181" y="81" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ifm-font-color-base)">Suche</text>
    <rect x="142" y="94" width="78" height="24" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="181" y="111" textAnchor="middle" fontSize="10.5" fill="var(--ifm-font-color-base)">Katalog</text>
    <rect x="142" y="124" width="78" height="24" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="181" y="141" textAnchor="middle" fontSize="10.5" fill="var(--ifm-font-color-base)">Versand</text>
  </g>

  <g opacity="0.75">
    <rect x="240" y="54" width="98" height="112" rx="8"
          fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
    <rect x="250" y="64" width="78" height="24" rx="4" fill="var(--ifm-color-warning-contrast-background)"/>
    <text x="289" y="81" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ifm-font-color-base)">Suche</text>
    <rect x="250" y="94" width="78" height="24" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="289" y="111" textAnchor="middle" fontSize="10.5" fill="var(--ifm-font-color-base)">Katalog</text>
    <rect x="250" y="124" width="78" height="24" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="289" y="141" textAnchor="middle" fontSize="10.5" fill="var(--ifm-font-color-base)">Versand</text>
  </g>

  <text x="181" y="192" textAnchor="middle" fontSize="12" fontWeight="700"
        fill="var(--ifm-font-color-base)">3 × alles</text>
  <text x="181" y="212" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Katalog und Versand laufen zweimal</text>
  <text x="181" y="228" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">umsonst mit</text>

  {/* ---------- Trennlinie ---------- */}
  <line x1="360" y1="46" x2="360" y2="250" stroke="var(--ifm-color-emphasis-400)" strokeDasharray="4 4"/>

  {/* ---------- Microservices ---------- */}
  <text x="544" y="20" textAnchor="middle" fontSize="14.5" fontWeight="700"
        fill="var(--ifm-font-color-base)">Microservices skalieren</text>
  <text x="544" y="40" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">dieselbe Überlast</text>

  <g>
    <rect x="392" y="54" width="88" height="30" rx="6" fill="var(--ifm-color-warning-contrast-background)"/>
    <rect x="392" y="54" width="88" height="30" rx="6" fill="none" stroke="var(--ifm-color-warning-dark)"/>
    <text x="436" y="74" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ifm-font-color-base)">Suche</text>

    <rect x="392" y="90" width="88" height="30" rx="6" fill="var(--ifm-color-warning-contrast-background)"/>
    <rect x="392" y="90" width="88" height="30" rx="6" fill="none" stroke="var(--ifm-color-warning-dark)"/>
    <text x="436" y="110" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ifm-font-color-base)">Suche</text>

    <rect x="392" y="126" width="88" height="30" rx="6" fill="var(--ifm-color-warning-contrast-background)"/>
    <rect x="392" y="126" width="88" height="30" rx="6" fill="none" stroke="var(--ifm-color-warning-dark)"/>
    <text x="436" y="146" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ifm-font-color-base)">Suche</text>
  </g>

  <g>
    <rect x="500" y="54" width="88" height="30" rx="6" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="544" y="74" textAnchor="middle" fontSize="10.5" fill="var(--ifm-font-color-base)">Katalog</text>

    <rect x="608" y="54" width="88" height="30" rx="6" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="652" y="74" textAnchor="middle" fontSize="10.5" fill="var(--ifm-font-color-base)">Versand</text>
  </g>

  <text x="544" y="192" textAnchor="middle" fontSize="12" fontWeight="700"
        fill="var(--ifm-font-color-base)">3 × Suche, 1 × der Rest</text>
  <text x="544" y="212" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">vervielfacht wird nur, was</text>
  <text x="544" y="228" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">wirklich unter Last steht</text>

  <text x="360" y="272" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Das ist der Kern des Skalierbarkeits-Arguments — und der einzige Vorteil, der sich sofort ausrechnen lässt.</text>
</svg>

## Der Schnitt: waagerecht oder senkrecht?

Bevor es um Microservices geht, lohnt eine Zwischenstufe — und sie erklärt, warum manche Monolithen altern und andere nicht.

Ein Monolith ist meist in **Schichten** geteilt: Web-Schicht, Fachlichkeit, Datenzugriff. Das ist ein **waagerechter** Schnitt, und du kennst ihn aus [Tutorial 04](/tutorial-04/04-service-schicht). Innerhalb einer Anwendung ist das genau richtig.

Der andere Schnitt geht **senkrecht**: nicht nach technischer Aufgabe, sondern nach **Fachlichkeit**. Alles, was zu „Bestellung" gehört — Oberfläche, Regeln, Tabellen —, liegt beieinander.

<svg viewBox="0 0 720 260" width="100%" role="img"
     aria-label="Waagerechter Schnitt trennt nach technischen Schichten, senkrechter Schnitt nach Fachlichkeit"
     fontFamily="var(--ifm-font-family-base)">

  {/* ---------- waagerecht ---------- */}
  <text x="176" y="20" textAnchor="middle" fontSize="14.5" fontWeight="700"
        fill="var(--ifm-font-color-base)">waagerecht: nach Technik</text>

  <rect x="24" y="36" width="304" height="42" rx="6"
        fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
  <text x="176" y="62" textAnchor="middle" fontSize="12" fill="var(--ifm-font-color-base)">Web-Schicht</text>

  <rect x="24" y="84" width="304" height="42" rx="6"
        fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
  <text x="176" y="110" textAnchor="middle" fontSize="12" fill="var(--ifm-font-color-base)">Fachlichkeit</text>

  <rect x="24" y="132" width="304" height="42" rx="6"
        fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
  <text x="176" y="158" textAnchor="middle" fontSize="12" fill="var(--ifm-font-color-base)">Datenzugriff</text>

  <text x="176" y="200" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Eine fachliche Änderung fasst</text>
  <text x="176" y="216" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">alle drei Schichten an.</text>

  {/* ---------- senkrecht ---------- */}
  <text x="544" y="20" textAnchor="middle" fontSize="14.5" fontWeight="700"
        fill="var(--ifm-font-color-base)">senkrecht: nach Fachlichkeit</text>

  <g>
    <rect x="392" y="36" width="94" height="138" rx="6"
          fill="var(--ifm-color-success-contrast-background)"/>
    <rect x="392" y="36" width="94" height="138" rx="6" fill="none"
          stroke="var(--ifm-color-success-dark)"/>
    <text x="439" y="58" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ifm-font-color-base)">Katalog</text>
    <text x="439" y="88" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Web</text>
    <text x="439" y="112" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Fachlichkeit</text>
    <text x="439" y="136" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Daten</text>
  </g>

  <g>
    <rect x="498" y="36" width="94" height="138" rx="6"
          fill="var(--ifm-color-success-contrast-background)"/>
    <rect x="498" y="36" width="94" height="138" rx="6" fill="none"
          stroke="var(--ifm-color-success-dark)"/>
    <text x="545" y="58" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ifm-font-color-base)">Bestellung</text>
    <text x="545" y="88" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Web</text>
    <text x="545" y="112" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Fachlichkeit</text>
    <text x="545" y="136" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Daten</text>
  </g>

  <g>
    <rect x="604" y="36" width="94" height="138" rx="6"
          fill="var(--ifm-color-success-contrast-background)"/>
    <rect x="604" y="36" width="94" height="138" rx="6" fill="none"
          stroke="var(--ifm-color-success-dark)"/>
    <text x="651" y="58" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ifm-font-color-base)">Versand</text>
    <text x="651" y="88" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Web</text>
    <text x="651" y="112" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Fachlichkeit</text>
    <text x="651" y="136" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-800)">Daten</text>
  </g>

  <text x="544" y="200" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Eine fachliche Änderung bleibt</text>
  <text x="544" y="216" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">in einem Streifen.</text>

  <text x="360" y="248" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Beide Schnitte schließen sich nicht aus: Jeder senkrechte Streifen ist innen waagerecht geschichtet.</text>
</svg>

Diese senkrechten Streifen tragen einen Namen: **Self-Contained Systems**, im deutschsprachigen Raum oft schlicht **Vertikalen**. Jede Vertikale ist für sich lauffähig, hat ihre eigenen Daten und ihre eigene Oberfläche.

:::tip Die wichtigste Einsicht dieses Blatts
Der Unterschied zwischen einem alternden Monolithen und einem, mit dem man in zehn Jahren noch arbeiten kann, ist **nicht** die Anzahl der Prozesse. Es ist der **Schnitt**.

Ein senkrecht geschnittener Monolith lässt sich später in Dienste zerlegen, weil die Grenzen schon da sind. Ein waagerecht geschnittener nicht — dort verläuft jede fachliche Grenze quer durch alle Schichten.

**Erst richtig schneiden, dann verteilen.** Wer verteilt, ohne geschnitten zu haben, bekommt einen Monolithen mit Netzwerk dazwischen — alle Nachteile beider Bauformen.
:::

## Was Microservices sind

Ein **Microservice** ist eine Vertikale, die als **eigener Prozess** läuft und über das Netzwerk angesprochen wird.

Die Merkmale, die zusammengehören:

| Merkmal | Was es bedeutet |
|---|---|
| **Fachlich geschnitten** | Ein Dienst gehört zu einem Fachgebiet, nicht zu einer technischen Schicht |
| **Unabhängig auslieferbar** | Der Katalog-Dienst geht live, ohne dass Versand angefasst wird |
| **Eigene Datenhaltung** | Kein anderer Dienst greift auf seine Tabellen zu — nur über seine Schnittstelle |
| **Über das Netz erreichbar** | Meist per HTTP und JSON — also mit genau dem, was du in diesem Lernfeld baust |
| **Ein Team pro Dienst** | Ein Dienst ist klein genug, dass ein Team ihn ganz versteht |

:::warning Die eigene Datenhaltung ist der harte Teil
Es klingt nach einer Nebensache, ist aber die Regel, an der die meisten Umbauten scheitern: **Zwei Dienste greifen nie auf dieselben Tabellen zu.**

Sobald der Versand-Dienst direkt in die Katalog-Tabellen schreibt, sind beide wieder aneinandergekettet — die Datenbank ist dann die gemeinsame Kupplung, und keiner der beiden lässt sich noch allein ändern. Man hat die Nachteile des Monolithen behalten und die Nachteile des Netzwerks dazugekauft.

Der Preis dieser Regel: Daten liegen mehrfach vor, und sie sind nicht in derselben Sekunde überall gleich.
:::

## Was es kostet

Ein Methodenaufruf im Monolithen kann nicht fehlschlagen. Ein Netzwerkaufruf kann immer fehlschlagen. Das ist der Kern aller Nachteile.

| Was im Monolithen selbstverständlich ist | Was daraus bei Microservices wird |
|---|---|
| Methodenaufruf, Nanosekunden | Netzwerkaufruf, Millisekunden — und er kann ausbleiben |
| Eine Transaktion über alles | Jeder Dienst hat seine eigene; über Dienstgrenzen gibt es **keine** gemeinsame |
| Ein Log, eine Fehlermeldung | Eine Anfrage hinterlässt Spuren in fünf Logs |
| Beim Kompilieren fällt auf, wenn ein Aufruf nicht mehr passt | Fällt erst zur Laufzeit auf — die Schnittstelle ist ein **Versprechen**, kein Vertrag, den der Compiler prüft |
| Eine Anwendung starten | Zehn Dienste starten, in der richtigen Reihenfolge |

Deshalb der oft zitierte Rat: **Fang mit einem Monolithen an.** Zerlege ihn, wenn du weißt, wo die Grenzen wirklich verlaufen — und nicht vorher, denn vorher weiß es niemand.

:::danger Die Fehlvorstellung, um die es hier geht
„Microservices sind moderner, also besser."

Sie sind eine **Antwort auf ein Organisationsproblem**: viele Menschen, die gleichzeitig an einem System arbeiten und sich nicht gegenseitig blockieren sollen. Wer dieses Problem nicht hat, hat auch den Nutzen nicht — zahlt aber den vollen Preis.

Es gibt gute Gründe für Microservices und gute Gründe dagegen. Was es nicht gibt, ist ein Grund, sie zu nehmen, weil sie neuer klingen.
:::

## Was ein Anwendungsentwickler darüber wissen muss

Du wirst als Auszubildende oder Auszubildender keine Systemarchitektur entwerfen. Du wirst aber sehr wahrscheinlich **an einem Dienst arbeiten, der einer von vielen ist**. Dafür ändert sich einiges an der täglichen Arbeit:

**1. Deine Schnittstelle ist ein Versprechen.**
Andere Teams verlassen sich darauf. Ein Feld umbenennen ist kein Refactoring mehr, sondern ein Bruch. Deshalb: neue Felder hinzufügen ja, vorhandene entfernen oder umdeuten nein — jedenfalls nicht ohne neue Version. Das ist auch der Grund, warum die Adresse `/api/**v1**/…` heißt.

**2. Fremde Dienste fallen aus. Immer.**
Nicht „falls", sondern „wann". Was dein Code deshalb braucht: einen **Timeout** bei jedem Aufruf (sonst wartest du ewig), eine Entscheidung, was ohne die fremde Antwort passieren soll, und einen Statuscode, der ehrlich ist — `503`, wenn du gerade nicht liefern kannst.

**3. Derselbe Aufruf kommt manchmal zweimal.**
Wenn eine Antwort ausbleibt, versucht der Aufrufer es erneut — obwohl deine Arbeit vielleicht schon getan war. Ein `POST`, der zweimal ankommt, darf nicht zwei Bestellungen anlegen. Das nennt man **Idempotenz**, und im Infoblatt [Das REST-Paradigma](/infoblaetter/rest-paradigma) steht, welche HTTP-Methoden sie von sich aus mitbringen und welche nicht.

**4. Dein Dienst merkt sich nichts zwischen zwei Anfragen.**
Wenn drei Kopien deines Dienstes laufen, landet die zweite Anfrage vielleicht bei einer anderen als die erste. Alles, was zwischen zwei Anfragen erhalten bleiben soll, gehört in die Datenbank — nicht in ein Feld der Klasse.

**5. Einstellungen kommen von außen.**
Datenbankadresse, Zugangsdaten, die Adresse des Nachbardienstes — nichts davon steht im Quelltext. Es kommt aus Umgebungsvariablen, damit dasselbe [Image](/infoblaetter/docker) in Entwicklung, Test und Betrieb laufen kann.

**6. Schreib Logs, an denen man eine Anfrage verfolgen kann.**
Wenn eine Bestellung durch vier Dienste läuft, will jemand später wissen, wo sie steckengeblieben ist. Dafür bekommt jede Anfrage eine Kennung, die mitgereicht und in jede Logzeile geschrieben wird.

## Die Verbindung zu diesem Lernfeld

Alles, was du in den Tutorials baust, ist genau das Handwerkszeug, aus dem Microservices bestehen:

| Was du gelernt hast | Wozu es im Verbund dient |
|---|---|
| REST-Endpunkte mit sauberen Adressen | So sprechen Dienste miteinander |
| [Statuscodes](/infoblaetter/http-kompakt) mit Bedeutung | So erfährt der Aufrufer, ob es geklappt hat — ohne den Rumpf zu lesen |
| [DTOs](/tutorial-04/03-antwort-selbst-entwerfen) statt Entitäten | So bleibt die Schnittstelle stabil, wenn sich die Datenbank ändert |
| [OpenAPI](/tutorial-02/03-api-dokumentieren) | So weiß das andere Team, was dein Dienst kann |
| [Automatisierte Tests](/tutorial-03/) | So merkst du, dass du dein Versprechen brichst, bevor der andere es merkt |
| [Docker](/infoblaetter/docker) | So wird dein Dienst vervielfacht, ohne dass jemand etwas installiert |

Ein einzelner Spring-Boot-Dienst mit eingebautem Webserver, in einen Container gepackt: Das **ist** die übliche Bauform eines Microservice. Du baust sie bereits — nur eben bisher allein und nicht im Verbund.

## Filme

Alle auf Deutsch:

| Film | Wofür |
|---|---|
| [Was ist ein Microservice?](https://www.youtube.com/watch?v=QUdELxSCVEY) (predic8) | Der Einstieg: Nachteile des Monolithen, Aufteilung in Dienste |
| [Monolithen vs. Microservices](https://www.youtube.com/watch?v=N0k3VKL4Als) (the native web) | Der direkte Vergleich beider Bauformen |
| [Warum ein Monolith oft besser ist als Microservices](https://www.youtube.com/watch?v=rcLG4ZsNEA0) (predic8) | Die Gegenrede — sieh dir diesen als **zweiten** an |

:::tip Warum der dritte Film wichtig ist
Nach zwei begeisterten Filmen bleibt leicht hängen: „Monolith alt, Microservices neu." Der dritte räumt das wieder ab — und erst mit beiden Seiten kann man die Frage beurteilen, statt sie zu glauben.
:::

## Das Wichtigste in Kürze

- Ein **Monolith** ist eine Anwendung aus einem Stück. Das ist meistens die richtige Wahl.
- Er wird eng, wenn **viele Menschen** gleichzeitig daran arbeiten und wenn nur **ein Teil** unter Last steht.
- Entscheidend ist der **Schnitt**: waagerecht nach Technik, senkrecht nach Fachlichkeit. Senkrechte Streifen heißen **Vertikalen** oder Self-Contained Systems.
- Ein **Microservice** ist eine Vertikale als eigener Prozess, mit **eigener Datenhaltung**, unabhängig auslieferbar, über das Netz erreichbar.
- Der Preis: Netzwerk statt Methodenaufruf, keine gemeinsame Transaktion, viele Logs, mehr Betrieb.
- Für dich heißt das: stabile Schnittstelle, Timeouts, Idempotenz, kein Zustand im Dienst, Einstellungen von außen.

## Weiterlesen

- [Docker und Container](/infoblaetter/docker) — die Verpackung, in der Dienste ausgeliefert werden
- [Das REST-Paradigma](/infoblaetter/rest-paradigma) — Idempotenz, sichere Methoden, Ressourcenschnitt
- [Was ist ein Webservice?](/infoblaetter/webservices) — die Grundlage darunter
