---
title: Werkzeuge in IntelliJ
sidebar_label: Werkzeuge in IntelliJ
sidebar_position: 6
---

# Werkzeuge in IntelliJ

## Warum das ein eigenes Infoblatt ist

Eine Entwicklungsumgebung ist kein besserer Texteditor. Sie hat den Quelltext **verstanden**: Sie weiß, welche Klasse von welcher erbt, wo eine Methode aufgerufen wird und welcher Bezeichner zu welcher Deklaration gehört.

Daraus folgt die Regel, die dieses ganze Blatt zusammenfasst:

> **Wenn du etwas von Hand suchst, ersetzt oder abtippst, hast du wahrscheinlich das falsche Werkzeug benutzt.**

Wer eine Klasse mit *Suchen und Ersetzen* umbenennt, erwischt auch den Text in einem Kommentar und in einer fremden Bibliothek. Wer sie mit **Umbenennen** umbenennt, erwischt genau die Stellen, die dasselbe meinen — und keine andere.

:::note Die Tastenkürzel in diesem Blatt
Alle Angaben gelten für die **Windows-Standardbelegung**. Wenn ein Kürzel nichts tut, steht die richtige Taste unter *File → Settings → Keymap*. Dort lässt sich auch nach dem Namen des Befehls suchen.
:::

## Die zwei Tasten, die alles andere ersetzen

| Taste | Name | Was sie tut |
|---|---|---|
| **Shift Shift** | Search Everywhere | Suchfeld über alles: Klassen, Dateien, Einstellungen, Befehle. Wenn du nicht weißt, wo etwas ist — hier anfangen |
| **Alt + Enter** | Kontextaktionen | Auf jedem rot oder gelb markierten Stück Code: IntelliJ schlägt die Behebung vor und führt sie aus |

`Alt + Enter` ist das wichtigste Kürzel der ganzen Umgebung. Fehlender Import, fehlender Konstruktor, unbenutzte Variable, „diese Schleife lässt sich als Stream schreiben" — die Umgebung weiß es und macht es.

:::tip Alt + Enter auch dann drücken, wenn nichts kaputt ist
Es geht nicht nur um Fehler. Auf einer Zeichenkette bietet es *Inject language*, auf einer Klasse *Implement methods*, auf einer Bedingung *Invert if*. Ausprobieren kostet nichts: Was du nicht auswählst, passiert nicht.
:::

## Navigieren statt scrollen

| Taste | Wohin |
|---|---|
| **Ctrl + N** | Zu einer Klasse |
| **Ctrl + Shift + N** | Zu einer Datei (auch `application.properties`, auch `docker-compose.yml`) |
| **Ctrl + B** *(oder Ctrl + Klick)* | Zur Deklaration — was ist das hier eigentlich? |
| **Ctrl + Alt + B** | Zur Implementierung — bei einer Schnittstelle: wer setzt sie um? |
| **Alt + F7** | Alle Verwendungen — wer ruft das auf? |
| **Ctrl + E** | Zuletzt geöffnete Dateien |
| **Ctrl + Shift + T** | Zwischen Klasse und Testklasse springen (und den Test anlegen, wenn es keinen gibt) |
| **Ctrl + F12** | Gliederung der aktuellen Datei — alle Methoden auf einen Blick |
| **Alt + 1** | Projektbaum ein-/ausblenden |

**Alt + F7** ist das Werkzeug, das man am meisten unterschätzt. Bevor du eine Methode änderst, sieh nach, wer sie benutzt. Das ist der Unterschied zwischen „läuft bei mir" und „läuft".

## Schreiben lassen statt tippen

| Taste | Was entsteht |
|---|---|
| **Alt + Einfg** | Konstruktor, Getter/Setter, `equals`/`hashCode`, `toString`, Testmethode |
| **Ctrl + O** | Methoden der Oberklasse überschreiben |
| **Ctrl + I** | Methoden einer Schnittstelle umsetzen |
| **Ctrl + Alt + T** | Markierten Code umschließen — mit `try`, `if`, einer Schleife |
| **Ctrl + Shift + Enter** | Anweisung vervollständigen: Klammer zu, Semikolon, Zeilenumbruch |

Dazu kommen **Kürzel im Editor**, die man einfach tippt und mit `Tab` bestätigt:

```java
psvm   → public static void main(String[] args) { }
sout   → System.out.println();
iter   → for (Typ element : sammlung) { }
```

Und die **Postfix-Vervollständigung**, die rückwärts arbeitet — erst der Ausdruck, dann was damit geschehen soll:

```java
supplier.getName().sout   → System.out.println(supplier.getName());
articles.for             → for (Article article : articles) { }
supplier.nn              → if (supplier != null) { }
```

:::info Warum das mehr ist als Tippersparnis
Wer `sout` tippt, macht keinen Tippfehler in `System.out.println`. Wer den Konstruktor erzeugen lässt, vergisst kein Feld. Die Zeit ist der kleinere Gewinn — der größere ist, dass eine ganze Fehlerklasse verschwindet.
:::

## Umbenennen und herausziehen

Das sind **Refactorings**: Änderungen, die den Code umbauen, ohne sein Verhalten zu ändern. IntelliJ zieht dabei alle betroffenen Stellen nach.

| Taste | Refactoring | Wofür |
|---|---|---|
| **Shift + F6** | Umbenennen | Klasse, Methode, Variable, Paket — überall zugleich |
| **Ctrl + Alt + M** | Methode extrahieren | Ein Stück Code bekommt einen Namen |
| **Ctrl + Alt + V** | Variable extrahieren | Aus einem verschachtelten Ausdruck wird eine benannte Zwischenstufe |
| **Ctrl + Alt + F** | Feld extrahieren | Aus der lokalen Variablen wird ein Feld |
| **F6** | Verschieben | Klasse in ein anderes Paket — die Imports wandern mit |
| **Ctrl + Alt + L** | Formatieren | Einrückung nach den Projektregeln |
| **Ctrl + Alt + O** | Imports aufräumen | Unbenutzte weg, Reihenfolge sortiert |

:::danger Nie mit Suchen und Ersetzen umbenennen
`Ctrl + R` kennt keine Bedeutung. Es ersetzt Text — auch in Kommentaren, auch in Zeichenketten, auch dort, wo dasselbe Wort etwas anderes meint.

`Shift + F6` kennt die Bedeutung. Es benennt **den einen Bezeichner** um und findet dabei auch die Stellen, an denen er anders geschrieben in einem Namen steckt (`supplierId` beim Umbenennen von `supplier`) — und fragt vorher.
:::

**Methode extrahieren** ist dabei das Refactoring mit dem größten Nutzen im Alltag: Wenn du in einer Service-Methode einen Kommentar schreiben willst, der erklärt, was die nächsten fünf Zeilen tun — markiere die fünf Zeilen, `Ctrl + Alt + M`, und gib ihnen den Namen, den du in den Kommentar geschrieben hättest.

## Der Debugger

Ein `System.out.println` beantwortet **eine** vorher gestellte Frage. Der Debugger lässt dich fragen, während das Programm steht.

<svg viewBox="0 0 720 330" width="100%" role="img"
     aria-label="Aufbau einer Debugger-Sitzung: Ein Haltepunkt am linken Rand hält das Programm an, im Variablenfenster stehen die aktuellen Werte, mit den Schritt-Tasten geht es weiter."
     fontFamily="var(--ifm-font-family-base)">

  {/* Editorflaeche */}
  <rect x="16" y="16" width="420" height="200" rx="9"
        fill="var(--ifm-background-surface-color)"/>
  <rect x="16" y="16" width="420" height="200" rx="9" fill="none"
        stroke="var(--ifm-color-emphasis-400)" strokeWidth="1.5"/>
  <rect x="16" y="16" width="34" height="200" rx="9"
        fill="var(--ifm-color-emphasis-200)"/>

  {/* Haltepunkt */}
  <circle cx="33" cy="96" r="8" fill="var(--ifm-color-danger-darkest)"/>
  <rect x="50" y="82" width="386" height="28"
        fill="var(--ifm-color-warning-contrast-background)"/>

  <text x="62" y="46" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">public void deleteSupplier(Long id) {'{'}</text>
  <text x="62" y="70" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">    long count = articleRepository.count…</text>
  <text x="62" y="101" fontSize="11.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-font-color-base)">    if (count &gt; 0) {'{'}</text>
  <text x="62" y="126" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">        throw new SupplierHasArticl…</text>
  <text x="62" y="150" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">    {'}'}</text>
  <text x="62" y="174" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">    repository.deleteById(id);</text>
  <text x="62" y="198" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">{'}'}</text>

  {/* Beschriftung Haltepunkt */}
  <path d="M 33 116 L 33 152 L 62 152" stroke="var(--zeichnung-rot)"
        strokeWidth="1.6" fill="none"/>
  <text x="20" y="248" fontSize="12" fontWeight="700"
        fill="var(--zeichnung-rot)">Haltepunkt (Strg + F8)</text>
  <text x="20" y="268" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Klick auf den linken Rand. Hier hält das</text>
  <text x="20" y="286" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Programm an — noch bevor die Zeile läuft.</text>

  {/* Variablenfenster */}
  <rect x="456" y="16" width="248" height="118" rx="9"
        fill="var(--ifm-color-info-contrast-background)"/>
  <rect x="456" y="16" width="248" height="118" rx="9" fill="none"
        stroke="var(--ifm-color-info-dark)" strokeWidth="1.5"/>
  <text x="472" y="40" fontSize="12.5" fontWeight="700"
        fill="var(--zeichnung-blau)">Variables</text>
  <text x="472" y="66" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">id = 7</text>
  <text x="472" y="88" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">count = 3</text>
  <text x="472" y="112" fontSize="11.5" fontStyle="italic"
        fill="var(--ifm-color-emphasis-800)">jedes Feld aufklappbar</text>

  {/* Schrittleiste */}
  <rect x="456" y="150" width="248" height="66" rx="9"
        fill="var(--ifm-color-emphasis-100)"/>
  <rect x="456" y="150" width="248" height="66" rx="9" fill="none"
        stroke="var(--ifm-color-emphasis-400)" strokeWidth="1.5"/>
  <text x="472" y="174" fontSize="11.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">F8</text>
  <text x="512" y="174" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">eine Zeile weiter</text>
  <text x="472" y="194" fontSize="11.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">F7</text>
  <text x="512" y="194" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">in die Methode hinein</text>
  <text x="472" y="212" fontSize="11.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--zeichnung-akzent)">F9</text>
  <text x="512" y="212" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">weiterlaufen lassen</text>

  {/* Auswerten */}
  <rect x="456" y="232" width="248" height="76" rx="9"
        fill="var(--ifm-color-success-contrast-background)"/>
  <rect x="456" y="232" width="248" height="76" rx="9" fill="none"
        stroke="var(--ifm-color-success-dark)" strokeWidth="1.5"/>
  <text x="472" y="256" fontSize="12.5" fontWeight="700"
        fill="var(--zeichnung-gruen)">Alt + F8 — Auswerten</text>
  <text x="472" y="278" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Beliebigen Ausdruck eintippen und</text>
  <text x="472" y="296" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">im angehaltenen Zustand ausrechnen.</text>
</svg>

| Taste | Wirkung |
|---|---|
| **Ctrl + F8** | Haltepunkt setzen oder entfernen |
| **Shift + F9** | Zuletzt Gestartetes im Debugger starten |
| **F8** | Eine Zeile weiter — Methodenaufrufe werden komplett ausgeführt |
| **F7** | In die aufgerufene Methode hinein |
| **Shift + F8** | Aus der Methode heraus |
| **F9** | Weiterlaufen bis zum nächsten Haltepunkt |
| **Alt + F8** | Ausdruck auswerten |

:::tip Der bedingte Haltepunkt
Rechtsklick auf einen gesetzten Haltepunkt öffnet ein kleines Feld für eine **Bedingung**, zum Beispiel `id == 7`.

Damit hält das Programm nur in dem einen Fall an, um den es geht — statt bei jedem der zweihundert Durchläufe. Das ist der Unterschied zwischen „Debugger ist mühsam" und „Debugger ist das schnellste Werkzeug im Kasten".
:::

:::warning Ein Haltepunkt in einer Spring-Anwendung kann die Anfrage abbrechen
Steht das Programm zu lange, läuft beim Client eine Zeitgrenze ab. Der Debugger ist dann nicht schuld an der Fehlermeldung — sie ist nur eine Folge.
:::

## Tests starten und lesen

| Taste / Ort | Wirkung |
|---|---|
| **grüner Pfeil** neben Klasse oder Methode | genau diesen Test starten |
| **Ctrl + Shift + F10** | den Test starten, in dem der Cursor steht |
| **Shift + F10** | den letzten Lauf wiederholen |
| Rechtsklick auf `src/test/java` | *Run All Tests* — alles auf einmal |
| im Testfenster: **Rerun Failed Tests** | nur die roten noch einmal |

Im Testfenster lohnt sich der Blick auf zwei Schaltflächen: **Sort by Duration** zeigt, welcher Test den Lauf ausbremst. Und der Filter **Show Passed** lässt sich abschalten — dann stehen nur noch die roten da.

Bei einem fehlgeschlagenen Test ist die Zeile `Click to see difference` das Ziel: Sie öffnet einen Vergleich zwischen Erwartung und Wirklichkeit, statt beides in einer langen Zeile aneinanderzukleben.

## Der HTTP-Client — die Datei `requests.http`

In den Tutorials liegt eine Datei mit Anfragen im Projekt. Das ist kein selbstgebautes Format, sondern ein eingebautes Werkzeug:

```http
### Alle Lieferanten
GET http://localhost:8080/api/v1/suppliers

### Einen anlegen
POST http://localhost:8080/api/v1/suppliers
Content-Type: application/json

{
  "name": "Nordwolle GmbH",
  "contact": { "street": "Am Deich 12", "postcode": "28199", "city": "Bremen" }
}
```

Neben jeder Anfrage erscheint ein grüner Pfeil. Die Antwort landet unten im Fenster — mit Statuscode, Kopfzeilen und formatiertem JSON.

Warum das besser ist, als jedes Mal im Browser oder in einem externen Programm zu klicken:

- Die Datei liegt **im Projekt** und wandert mit ins Repository. Wer es klont, hat die Beispielanfragen sofort.
- Sie ist Dokumentation, die nicht veraltet — wer eine Anfrage ändert, merkt es beim nächsten Ausführen.
- Die `###`-Zeile darüber ist der Name. Sie steht in der Liste der letzten Ausführungen.

:::info Variablen sparen das Suchen und Ersetzen
```http
@host = http://localhost:8080/api/v1

### Alle Lieferanten
GET {{host}}/suppliers
```
Wenn der Port sich ändert, ändert sich **eine** Zeile.
:::

## Das Datenbank-Werkzeug

Die Leiste **Database** am rechten Rand verbindet sich direkt mit der PostgreSQL im Container — kein zusätzliches Programm nötig.

| Schritt | |
|---|---|
| **Verbinden** | **+ → Data Source → PostgreSQL**, dann Host `localhost`, Port, Datenbank, Benutzer und Passwort aus der `docker-compose.yml` |
| **Treiber** | Beim ersten Mal bietet IntelliJ *Download missing driver files* an — bestätigen |
| **Prüfen** | *Test Connection* muss grün sein, bevor es weitergeht |
| **Ansehen** | Doppelklick auf eine Tabelle öffnet ihren Inhalt |
| **Abfragen** | Rechtsklick auf die Datenbank → *New → Query Console* |
| **Auffrischen** | Die Ansicht aktualisiert sich **nicht** von selbst — der Kreispfeil oder `Ctrl + F5` |

:::tip Das eigentliche Kunststück: die Tabellen sehen, die Hibernate angelegt hat
Wenn `spring.jpa.hibernate.ddl-auto=update` steht, entstehen die Tabellen aus deinen Entitäten. Was dabei tatsächlich herauskommt — Spaltentypen, Fremdschlüssel, Verknüpfungstabellen — steht nirgends im Quelltext.

Hier kannst du es nachsehen. Der Unterschied zwischen einer 1:n- und einer n:m-Beziehung ist im Schema genau **eine** Bedingung; siehe [Beziehungen mit JPA abbilden](/infoblaetter/jpa-beziehungen).
:::

## Das Maven-Fenster

Rechte Leiste **Maven**. Zwei Dinge braucht man dort regelmäßig:

- **Reload All Maven Projects** (die kreisenden Pfeile) — nach jeder Änderung an der `pom.xml`. Wenn IntelliJ eine gerade hinzugefügte Bibliothek nicht kennt, ist das fast immer die Ursache.
- **Lifecycle → clean / test / package** — dieselben Ziele wie im Terminal, nur zum Anklicken. Mehr dazu im Infoblatt [Maven und Abhängigkeiten](/infoblaetter/maven).

## Wenn etwas nicht geht

| Beobachtung | Was zuerst zu versuchen ist |
|---|---|
| Eine neue Abhängigkeit wird nicht gefunden | Maven-Fenster → *Reload All Maven Projects* |
| Alles ist rot, obwohl der Code stimmt | *File → Invalidate Caches… → Invalidate and Restart* |
| „Cannot find symbol" nur beim Bauen, nicht im Editor | *Build → Rebuild Project* |
| Lombok-Getter werden nicht gefunden | *Settings → Build → Compiler → Annotation Processors* → Häkchen bei *Enable annotation processing* |
| Die falsche Java-Version wird benutzt | *File → Project Structure → Project → SDK* |
| Der falsche Import wird vorgeschlagen | Import löschen, `Alt + Enter` auf dem Bezeichner, aus der Liste den richtigen wählen |
| Der Port ist belegt | Vorherigen Lauf im Fenster *Run* beenden (rotes Quadrat) |

:::warning Der falsche Import ist in diesem Kurs der häufigste Zeitfresser
Mit Spring Boot 4 haben sich viele Paketpfade geändert. IntelliJ schlägt beim automatischen Import gern die alte Klasse aus einer mitgelieferten Bibliothek vor — der Code lässt sich übersetzen und der Test tut trotzdem nichts.

Bei allem, was mit Tests zu tun hat, lohnt sich der Blick auf die Importzeile. Die richtigen Pfade stehen im Infoblatt [Automatisiert testen](/infoblaetter/automatisiert-testen).
:::

## Community oder Ultimate?

| Funktion | Community | Ultimate |
|---|---|---|
| Java, Maven, JUnit, Debugger, Refactorings | ✓ | ✓ |
| Spring Initializr im Neu-Dialog | — | ✓ |
| Datenbank-Werkzeug und SQL-Konsole | — | ✓ |
| HTTP-Client (`.http`-Dateien) | — | ✓ |
| Spring-Unterstützung (Endpoints-Fenster, Bohnen-Navigation) | — | ✓ |

Für diesen Kurs wird **Ultimate** gebraucht. Auszubildende und Studierende bekommen darauf eine kostenlose Lizenz über das JetBrains-Bildungsprogramm — mit der Schulbescheinigung oder der Schul-Mailadresse.

## Spickzettel

| | |
|---|---|
| **Shift Shift** | alles suchen |
| **Alt + Enter** | Vorschlag anwenden |
| **Ctrl + N** / **Ctrl + Shift + N** | Klasse / Datei |
| **Ctrl + B** | zur Deklaration |
| **Alt + F7** | alle Verwendungen |
| **Ctrl + Shift + T** | Klasse ↔ Test |
| **Alt + Einfg** | erzeugen |
| **Shift + F6** | umbenennen |
| **Ctrl + Alt + M** | Methode extrahieren |
| **Ctrl + Alt + L** | formatieren |
| **Ctrl + F8** / **Shift + F9** | Haltepunkt / Debuggen |
| **F8** / **F7** / **F9** | weiter / hinein / laufen lassen |
| **Ctrl + Shift + F10** | Test unter dem Cursor starten |
| **Ctrl + Shift + F** | in allen Dateien suchen |
| **Ctrl + Shift + A** | Befehl suchen, wenn dir das Kürzel fehlt |

Das letzte Kürzel ist das nützlichste dieser Liste: **Ctrl + Shift + A** sucht nach dem **Namen** eines Befehls und zeigt dir sein Kürzel gleich mit an. Damit lernt man die anderen nebenbei.

## Das Wichtigste in Kürze

- Was du von Hand suchst oder ersetzt, kann die Umgebung meist besser — sie kennt die Bedeutung, nicht nur den Text.
- **Alt + Enter** ist der Allzweckgriff, **Shift Shift** die Suche über alles.
- Umbenannt wird mit **Shift + F6**, nie mit *Suchen und Ersetzen*.
- **Alt + F7** vor jeder Änderung: Wer benutzt das eigentlich?
- Der Debugger mit **bedingtem Haltepunkt** ist schneller als jedes `println`.
- `requests.http` ist ein eingebautes Werkzeug und gehört ins Repository.
- Die Leiste **Database** zeigt, was Hibernate wirklich angelegt hat.
- Bei rätselhaften Fehlern: erst *Reload Maven*, dann *Invalidate Caches*, dann suchen.

## Weiterlesen

- [Maven und Abhängigkeiten](/infoblaetter/maven) — was hinter dem Maven-Fenster steckt
- [Automatisiert testen](/infoblaetter/automatisiert-testen) — die Importpfade, die IntelliJ gern falsch vorschlägt
- [Docker und Container](/infoblaetter/docker) — die Datenbank, mit der sich das Datenbank-Werkzeug verbindet
- [Lombok](/infoblaetter/lombok) — warum die Anmerkungsverarbeitung eingeschaltet sein muss
