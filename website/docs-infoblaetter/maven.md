---
title: Maven und Abhängigkeiten
sidebar_label: Maven und Abhängigkeiten
sidebar_position: 5
---

# Maven und Abhängigkeiten

## Das Problem: Software besteht nicht nur aus eigenem Code

Dein Webservice soll HTTP sprechen, JSON lesen, mit einer Datenbank reden und einen Webserver starten. Nichts davon schreibst du selbst — das haben andere schon gebaut und als **Bibliothek** veröffentlicht.

Ohne Hilfsmittel müsstest du:

1. jede Bibliothek als `.jar`-Datei von irgendeiner Website herunterladen,
2. sie in einen Ordner legen und dem Compiler bekannt machen,
3. herausfinden, welche **weiteren** Bibliotheken sie ihrerseits braucht,
4. das alles bei jedem Update wiederholen,
5. und sicherstellen, dass jeder im Team exakt dieselben Versionen hat.

Spätestens bei Schritt 3 wird es unübersichtlich. Genau dafür gibt es **Maven**.

:::info Was Maven ist
Ein **Build-Werkzeug**. Es beschafft die benötigten Bibliotheken, übersetzt den Quelltext, führt die Tests aus und packt am Ende ein auslieferbares Programm.

Die Beschreibung des Projekts steht in einer einzigen Datei: der `pom.xml`.
:::

## Die `pom.xml`

*POM* steht für **P**roject **O**bject **M**odel. Die Datei beschreibt vor allem, **was** das Projekt ist und **was es braucht**. Wie gebaut wird, muss man dagegen selten aufschreiben: Maven bringt dafür einen Standardablauf mit. (Wo es nötig ist, lässt er sich in der `pom.xml` anpassen — im Gästebuch-Projekt steht so ein Eintrag für Lombok.)

```xml
<project>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.1.1</version>
    </parent>

    <groupId>de.szut</groupId>
    <artifactId>personenverwaltung</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <properties>
        <java.version>25</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webmvc</artifactId>
        </dependency>
    </dependencies>
</project>
```

### Die Adresse einer Bibliothek

Jede Bibliothek der Welt ist über drei Angaben eindeutig bestimmt — man nennt sie **GAV-Koordinaten**:

| Angabe | Bedeutung | Beispiel |
|---|---|---|
| **G**roupId | Wer hat es gebaut? Meist eine umgekehrte Domain | `org.springframework.boot` |
| **A**rtifactId | Wie heißt das Bauteil? | `spring-boot-starter-webmvc` |
| **V**ersion | Welcher Stand? | `4.1.1` |

Dein eigenes Projekt hat ebenfalls solche Koordinaten — `de.szut` / `personenverwaltung` / `0.0.1-SNAPSHOT`. Genau die hast du im Spring Initializr eingetragen.

:::tip Warum `SNAPSHOT`?
Der Zusatz kennzeichnet eine Version **in Entwicklung**, die sich noch ändern darf. Eine Version ohne diesen Zusatz gilt als fertig und wird nie wieder verändert.
:::

## Woher die Bibliotheken kommen

Maven lädt sie aus einem **Repository** — einem öffentlichen Archiv im Internet. Der Standard heißt **Maven Central** und enthält Millionen von Bibliotheken.

<svg viewBox="0 0 720 330" width="100%" role="img"
     aria-label="Maven prüft erst das lokale Repository und lädt nur bei Bedarf aus Maven Central"
     fontFamily="var(--ifm-font-family-base)">

  {/* Projekt */}
  <g transform="translate(14,116)">
    <rect width="156" height="94" rx="11" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)" strokeWidth="1.5"/>
    <g transform="translate(20,18)" stroke="var(--ifm-color-emphasis-700)" strokeWidth="1.8" fill="none">
      <path d="M0 0 L16 0 L24 8 L24 30 L0 30 Z"/>
      <path d="M16 0 L16 8 L24 8"/>
    </g>
    <text x="56" y="30" fontSize="13" fontWeight="700" fill="var(--ifm-font-color-base)">Dein Projekt</text>
    <text x="20" y="66" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">pom.xml</text>
    <text x="20" y="84" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">listet die Wünsche</text>
  </g>

  {/* Schritt 1 */}
  <path d="M176 148 L242 148" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <path d="M235 143 L244 148 L235 153" fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <circle cx="209" cy="130" r="11" fill="var(--ifm-color-primary)"/>
  <text x="209" y="134" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">1</text>
  <text x="209" y="172" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">Was brauche ich?</text>

  {/* Maven */}
  <g transform="translate(248,124)">
    <rect width="112" height="78" rx="11" fill="var(--ifm-color-primary)" opacity="0.14"/>
    <rect width="112" height="78" rx="11" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
    <text x="56" y="34" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ifm-font-color-base)">Maven</text>
    <text x="56" y="56" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">beschafft</text>
  </g>

  {/* Schritt 2 */}
  <path d="M366 148 L432 148" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <path d="M425 143 L434 148 L425 153" fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth="2"/>
  <circle cx="399" cy="130" r="11" fill="var(--ifm-color-primary)"/>
  <text x="399" y="134" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">2</text>
  <text x="399" y="172" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">Schon da?</text>

  {/* Lokales Repository */}
  <g transform="translate(438,110)">
    <rect width="150" height="106" rx="11" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-400)" strokeWidth="1.8"/>
    <g transform="translate(18,18)" stroke="var(--ifm-color-emphasis-700)" strokeWidth="1.8" fill="none">
      <rect x="0" y="0" width="26" height="28" rx="2.5"/>
      <path d="M0 9 L26 9 M0 19 L26 19"/>
    </g>
    <text x="54" y="32" fontSize="12.5" fontWeight="700" fill="var(--ifm-font-color-base)">Lokales</text>
    <text x="54" y="48" fontSize="12.5" fontWeight="700" fill="var(--ifm-font-color-base)">Repository</text>
    <text x="18" y="76" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">.m2/repository</text>
    <text x="18" y="94" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">auf deinem Rechner</text>
  </g>

  {/* Schritt 3: nur falls nicht vorhanden */}
  <path d="M513 106 L513 66" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8" strokeDasharray="6 4"/>
  <path d="M508 74 L513 64 L518 74" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
  <circle cx="547" cy="88" r="11" fill="var(--ifm-color-emphasis-600)"/>
  <text x="547" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">3</text>
  <text x="565" y="92" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">nur falls sie fehlt</text>

  <g transform="translate(438,14)">
    <rect width="268" height="50" rx="10" fill="var(--ifm-background-color)" stroke="var(--ifm-color-emphasis-400)" strokeWidth="1.6" strokeDasharray="6 5"/>
    <text x="18" y="22" fontSize="12.5" fontWeight="700" fill="var(--ifm-font-color-base)">Maven Central</text>
    <text x="18" y="40" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">das öffentliche Archiv im Internet</text>
  </g>

  {/* Schritt 4: zurück ans Projekt */}
  <path d="M512 220 C512 268 92 268 92 222" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <path d="M87 230 L92 220 L97 230" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <circle cx="302" cy="264" r="11" fill="var(--ifm-color-primary)"/>
  <text x="302" y="268" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">4</text>
  <text x="324" y="268" fontSize="11" fill="var(--ifm-color-emphasis-800)">bereitstellen — ab jetzt ohne Internet</text>

  <text x="360" y="312" textAnchor="middle" fontSize="12" fill="var(--ifm-color-emphasis-700)">Deshalb dauert nur der erste Start lange, jeder weitere nur Sekunden</text>
</svg>

:::warning Dasselbe Wort, zwei völlig verschiedene Dinge
Dir begegnet **Repository** in diesem Kurs zweimal, und die beiden haben nichts miteinander zu tun:

| | Was es ist |
|---|---|
| **Maven-Repository** | Ein Archiv mit `.jar`-Dateien — hier auf dieser Seite gemeint |
| **Spring-Data-Repository** | Ein Java-Interface für den Datenbankzugriff, etwa `PersonRepository` |

Wer aus dem ersten Lehrjahr `DAO` kennt: Das Spring-Data-Repository ist dasselbe Konzept. Mit Maven hat es nichts zu tun.
:::

Heruntergeladene Bibliotheken landen im **lokalen Repository** auf deinem Rechner (`C:\Users\<name>\.m2\repository`). Deshalb dauert der erste Projektstart lange und jeder weitere nur noch Sekunden — beim zweiten Mal ist alles schon da.

## Transitive Abhängigkeiten

Das ist der eigentliche Gewinn. Eine Bibliothek braucht selbst wieder Bibliotheken, und die wieder andere. Maven verfolgt diese Kette automatisch.

Ein Blick in dein eigenes Projekt macht das greifbar:

```text
spring-boot-starter-webmvc
├── spring-boot-starter-jackson
│   └── spring-boot-jackson
│       └── jackson-databind          ← wandelt JSON in Objekte um
│           ├── jackson-annotations
│           └── jackson-core
└── spring-boot-starter-tomcat
    └── tomcat-embed-core             ← der eingebaute Webserver
```

<svg viewBox="0 0 720 230" width="100%" role="img"
     aria-label="Aus 8 deklarierten Abhängigkeiten werden 123 tatsächlich geladene Dateien"
     fontFamily="var(--ifm-font-family-base)">

  {/* obere Leiste: was du schreibst */}
  <text x="16" y="26" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Das schreibst du in die pom.xml</text>
  <rect x="16" y="38" width="43" height="36" rx="6" fill="var(--ifm-color-primary)"/>
  <text x="72" y="55" fontSize="19" fontWeight="800" fill="var(--ifm-color-primary)">8</text>
  <text x="94" y="55" fontSize="13" fill="var(--ifm-color-emphasis-800)">Abhängigkeiten</text>
  <text x="94" y="72" fontSize="11" fill="var(--ifm-color-emphasis-700)">vier Starter, H2 und drei Test-Bausteine</text>

  {/* untere Leiste: was Maven laedt */}
  <text x="16" y="120" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Das lädt Maven tatsächlich herunter</text>
  <rect x="16" y="132" width="688" height="36" rx="6" fill="var(--ifm-color-emphasis-300)"/>
  <rect x="16" y="132" width="43" height="36" rx="6" fill="var(--ifm-color-primary)"/>
  <text x="16" y="192" fontSize="19" fontWeight="800" fill="var(--ifm-color-emphasis-800)">123</text>
  <text x="58" y="192" fontSize="13" fill="var(--ifm-color-emphasis-800)">JAR-Dateien</text>

  {/* Beschriftung der beiden Anteile */}
  <path d="M37 176 L37 168" stroke="var(--ifm-color-primary)" strokeWidth="1.6"/>
  <path d="M380 176 L380 168" stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.6"/>
  <text x="380" y="192" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ifm-color-emphasis-700)">115 kommen automatisch mit</text>
  <text x="380" y="216" textAnchor="middle" fontSize="12" fill="var(--ifm-color-emphasis-700)">Das sind die transitiven Abhängigkeiten — Maven verfolgt die Kette für dich</text>
</svg>

:::info Die Zahl in deinem Projekt
In deiner `pom.xml` stehen **8 Abhängigkeiten**. Tatsächlich lädt Maven **123 JAR-Dateien** — alles Weitere sind transitive Abhängigkeiten.

Das kannst du selbst nachsehen:

```bash
./mvnw dependency:tree
```
:::

Genau deshalb hast du **Jackson** nie eingebunden, obwohl deine Anwendung JSON verarbeitet: Es kommt über `spring-boot-starter-webmvc` mit.

## Starter: fertig geschnürte Bündel

Bibliotheken, deren Name mit `spring-boot-starter-` beginnt, enthalten selbst fast keinen Code. Sie sind **Bündel**, die eine sinnvolle Kombination anderer Bibliotheken zusammenfassen.

| Starter | Bringt mit |
|---|---|
| `spring-boot-starter-webmvc` | Spring MVC, Tomcat, Jackson |
| `spring-boot-starter-data-jpa` | Spring Data JPA, **Hibernate**, Verbindungspool |
| `spring-boot-starter-actuator` | Überwachungs-Endpunkte |

Der Vorteil: Du triffst eine Entscheidung („ich baue eine Web-Anwendung") statt fünfzehn.

## Warum bei den meisten Abhängigkeiten keine Version steht

Ist dir aufgefallen, dass in der `pom.xml` fast überall die `<version>` fehlt? Das liegt am `<parent>`-Eintrag:

```xml
<parent>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.1</version>
</parent>
```

Dieser Eltern-POM enthält eine große, geprüfte Liste: Zu Spring Boot 4.1.1 gehört Spring Framework 7.0.9, Jackson 3.1.5, Tomcat 11.0.24 und so weiter. Alle diese Versionen sind aufeinander abgestimmt.

:::warning Eine Version selbst festlegen
Du *kannst* eine Version angeben und damit die Vorgabe überstimmen. Tu es nur, wenn du einen guten Grund hast — du verlässt damit die geprüfte Kombination und kannst schwer auffindbare Fehler erzeugen.
:::

## Der Maven Wrapper

Im Projekt liegen zwei Dateien, die du nicht selbst angelegt hast: `mvnw` (Linux/macOS) und `mvnw.cmd` (Windows). Das ist der **Maven Wrapper**.

Er lädt beim ersten Aufruf genau die Maven-Version herunter, die zum Projekt gehört, und benutzt diese. Ergebnis: Alle bauen mit derselben Version — unabhängig davon, was auf dem einzelnen Rechner installiert ist. Auf manchen Rechnern muss Maven gar nicht erst installiert sein.

```bash
mvnw.cmd clean verify
```

:::tip In Betrieben gilt
Nutze den Wrapper, nicht dein lokales Maven. Er ist der Grund, warum ein Projekt auf dem Rechner der Kollegin genauso baut wie auf deinem und wie auf dem Build-Server.
:::

## Die wichtigsten Befehle

Maven arbeitet in **Phasen**, die aufeinander aufbauen. Ruft man eine Phase auf, laufen alle vorherigen mit.

| Befehl | Was passiert |
|---|---|
| `mvnw clean` | löscht den Ordner `target` mit allen Bauergebnissen |
| `mvnw compile` | übersetzt den Quelltext nach `target/classes` |
| `mvnw test` | compile **+** führt die Tests aus |
| `mvnw package` | test **+** packt eine `.jar`-Datei |
| `mvnw verify` | package **+** zusätzliche Prüfungen |
| `mvnw spring-boot:run` | startet die Anwendung direkt |

:::note `clean` ist kein Allheilmittel, aber oft die Lösung
Wenn sich der Build merkwürdig verhält, obwohl der Code richtig aussieht, liegen häufig alte Bauergebnisse im `target`-Ordner. `mvnw clean verify` baut alles von Grund auf neu.
:::

## Wo die Abhängigkeiten im Projekt landen

| Ordner | Inhalt | In die Versionsverwaltung? |
|---|---|---|
| `src/` | dein Quelltext | **ja** |
| `pom.xml` | die Projektbeschreibung | **ja** |
| `mvnw`, `.mvn/` | der Wrapper | **ja** |
| `target/` | Bauergebnisse, erzeugte `.jar` | **nein** |
| `.m2/repository` | heruntergeladene Bibliotheken | liegt außerhalb des Projekts |

Bibliotheken werden also **nie** ins Projekt kopiert. Weitergegeben wird nur die `pom.xml` — der Rest lässt sich daraus jederzeit wiederherstellen.

:::note Das hast du gelernt
- **Maven** beschafft Bibliotheken, übersetzt, testet und paketiert. Beschrieben wird das Projekt in der `pom.xml`.
- Jede Bibliothek hat **GAV-Koordinaten**: GroupId, ArtifactId, Version.
- Bibliotheken kommen aus **Maven Central** und liegen danach im lokalen Repository.
- **Transitive Abhängigkeiten** zieht Maven automatisch mit — aus 8 Einträgen werden 123 JAR-Dateien.
- **Starter** sind Bündel; die `<parent>`-Angabe legt die abgestimmten Versionen fest.
- Der **Wrapper** (`mvnw`) sorgt dafür, dass alle mit derselben Maven-Version bauen.
- Bibliotheken landen nie im Projektordner — weitergegeben wird die `pom.xml`.
:::
