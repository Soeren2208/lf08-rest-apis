---
title: Docker und Container
sidebar_label: Docker und Container
sidebar_position: 15
---

# Docker und Container

## Der Satz, den es abschaffen soll

> „Bei mir läuft es doch."

Diesen Satz hat jede Entwicklerin schon gesagt und jeder Entwickler schon gehört. Die Software läuft auf dem einen Rechner und auf dem anderen nicht — und niemand weiß auf Anhieb, warum.

Die Gründe sind fast immer dieselben:

| | |
|---|---|
| **Andere Version** | Bei dir Java 26, auf dem Server Java 21 |
| **Fehlendes Zubehör** | Bei dir läuft eine PostgreSQL, auf dem Testrechner nicht |
| **Andere Einstellung** | Eine Umgebungsvariable, die nur bei dir gesetzt ist |
| **Andere Reihenfolge** | Die Datenbank war schon da, als die Anwendung startete — beim Kollegen nicht |

Jeder einzelne Punkt ist behebbar. Zusammen kosten sie in jedem Projekt Tage.

**Die Idee von Docker:** Nicht nur das Programm ausliefern, sondern das Programm **samt seiner Umgebung**. Was einmal läuft, läuft überall gleich.

## Was ein Container ist

Ein **Container** ist ein Prozess, der so abgeschottet läuft, als hätte er den Rechner für sich allein. Er bringt alles mit, was er braucht: seine Programmbibliotheken, seine Konfiguration, seine Dateien. Was er **nicht** mitbringt, ist ein eigenes Betriebssystem.

Genau darin unterscheidet er sich von einer virtuellen Maschine.

<svg viewBox="0 0 720 340" width="100%" role="img"
     aria-label="Vergleich virtuelle Maschine und Container: Bei der VM hat jede Anwendung ein eigenes Gastbetriebssystem, beim Container teilen sich alle Anwendungen den Kern des Wirtsbetriebssystems"
     fontFamily="var(--ifm-font-family-base)">

  {/* ---------------- linke Seite: virtuelle Maschinen ---------------- */}
  <text x="176" y="22" textAnchor="middle" fontSize="15" fontWeight="700"
        fill="var(--ifm-font-color-base)">Virtuelle Maschinen</text>

  <g>
    <rect x="16" y="36" width="320" height="72" rx="8"
          fill="var(--ifm-color-emphasis-200)"/>
    <rect x="26" y="46" width="145" height="52" rx="6"
          fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="98" y="66" textAnchor="middle" fontSize="12" fontWeight="700"
          fill="var(--ifm-font-color-base)">Anwendung A</text>
    <text x="98" y="86" textAnchor="middle" fontSize="11"
          fill="var(--ifm-color-emphasis-800)">Bibliotheken</text>

    <rect x="181" y="46" width="145" height="52" rx="6"
          fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="253" y="66" textAnchor="middle" fontSize="12" fontWeight="700"
          fill="var(--ifm-font-color-base)">Anwendung B</text>
    <text x="253" y="86" textAnchor="middle" fontSize="11"
          fill="var(--ifm-color-emphasis-800)">Bibliotheken</text>
  </g>

  <g>
    <rect x="26" y="116" width="145" height="42" rx="6"
          fill="var(--ifm-color-warning-contrast-background)"/>
    <rect x="26" y="116" width="145" height="42" rx="6" fill="none"
          stroke="var(--ifm-color-warning-dark)"/>
    <text x="98" y="142" textAnchor="middle" fontSize="12" fontWeight="700"
          fill="var(--ifm-font-color-base)">Gast-Betriebssystem</text>

    <rect x="181" y="116" width="145" height="42" rx="6"
          fill="var(--ifm-color-warning-contrast-background)"/>
    <rect x="181" y="116" width="145" height="42" rx="6" fill="none"
          stroke="var(--ifm-color-warning-dark)"/>
    <text x="253" y="142" textAnchor="middle" fontSize="12" fontWeight="700"
          fill="var(--ifm-font-color-base)">Gast-Betriebssystem</text>
  </g>

  <rect x="16" y="166" width="320" height="40" rx="8"
        fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
  <text x="176" y="191" textAnchor="middle" fontSize="12.5" fontWeight="700"
        fill="var(--ifm-font-color-base)">Hypervisor</text>

  <rect x="16" y="214" width="320" height="40" rx="8"
        fill="var(--ifm-color-emphasis-200)"/>
  <text x="176" y="239" textAnchor="middle" fontSize="12.5"
        fill="var(--ifm-font-color-base)">Wirts-Betriebssystem</text>

  <rect x="16" y="262" width="320" height="36" rx="8"
        fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
  <text x="176" y="285" textAnchor="middle" fontSize="12.5"
        fill="var(--ifm-font-color-base)">Hardware</text>

  <text x="176" y="322" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">jede Anwendung schleppt ein ganzes Betriebssystem mit</text>

  {/* ---------------- rechte Seite: Container ---------------- */}
  <text x="544" y="22" textAnchor="middle" fontSize="15" fontWeight="700"
        fill="var(--ifm-font-color-base)">Container</text>

  <g>
    <rect x="384" y="36" width="320" height="72" rx="8"
          fill="var(--ifm-color-emphasis-200)"/>
    <rect x="394" y="46" width="145" height="52" rx="6"
          fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="466" y="66" textAnchor="middle" fontSize="12" fontWeight="700"
          fill="var(--ifm-font-color-base)">Anwendung A</text>
    <text x="466" y="86" textAnchor="middle" fontSize="11"
          fill="var(--ifm-color-emphasis-800)">Bibliotheken</text>

    <rect x="549" y="46" width="145" height="52" rx="6"
          fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="621" y="66" textAnchor="middle" fontSize="12" fontWeight="700"
          fill="var(--ifm-font-color-base)">Anwendung B</text>
    <text x="621" y="86" textAnchor="middle" fontSize="11"
          fill="var(--ifm-color-emphasis-800)">Bibliotheken</text>
  </g>

  <rect x="384" y="116" width="320" height="42" rx="8"
        fill="var(--ifm-color-success-contrast-background)"/>
  <rect x="384" y="116" width="320" height="42" rx="8" fill="none"
        stroke="var(--ifm-color-success-dark)"/>
  <text x="544" y="142" textAnchor="middle" fontSize="12.5" fontWeight="700"
        fill="var(--ifm-font-color-base)">Container-Laufzeit (Docker)</text>

  <rect x="384" y="166" width="320" height="88" rx="8"
        fill="var(--ifm-color-emphasis-200)"/>
  <text x="544" y="203" textAnchor="middle" fontSize="12.5"
        fill="var(--ifm-font-color-base)">Wirts-Betriebssystem</text>
  <text x="544" y="226" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">ein Kern für alle Container</text>

  <rect x="384" y="262" width="320" height="36" rx="8"
        fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
  <text x="544" y="285" textAnchor="middle" fontSize="12.5"
        fill="var(--ifm-font-color-base)">Hardware</text>

  <text x="544" y="322" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">alle teilen sich einen Betriebssystemkern</text>
</svg>

Daraus folgt der praktische Unterschied:

| | Virtuelle Maschine | Container |
|---|---|---|
| Startzeit | Minute(n) — das Betriebssystem fährt hoch | Sekunden — nur ein Prozess startet |
| Größe | Gigabyte | Megabyte |
| Wie viele parallel? | eine Handvoll | Dutzende |
| Isolation | sehr stark (eigener Kern) | stark, aber gemeinsamer Kern |

:::danger Die häufigste Fehlvorstellung
„Ein Container ist eine kleine virtuelle Maschine."

**Nein.** In einem Container läuft **kein Betriebssystem**. Es läuft ein Prozess, den der Kern des Wirtssystems so abschottet, dass er die anderen nicht sieht.

Der Beweis liegt direkt vor dir: Öffne die Prozessliste deines Rechners, während ein Container läuft. Der Datenbankprozess steht dort — als gewöhnlicher Prozess. Es gibt keine zweite Maschine, in der er sich versteckt.

Die praktische Folge: Auf einem Linux-Kern laufen nur Linux-Container. Dass es unter Windows trotzdem funktioniert, liegt daran, dass Docker Desktop im Hintergrund **eine** schlanke Linux-VM betreibt — eine für alle Container, nicht eine pro Container.
:::

## Die drei Begriffe, die man ständig verwechselt

<svg viewBox="0 0 720 190" width="100%" role="img"
     aria-label="Registry enthält Images, aus einem Image entstehen mehrere Container"
     fontFamily="var(--ifm-font-family-base)">

  <g>
    <rect x="16" y="40" width="180" height="96" rx="10"
          fill="var(--ifm-color-emphasis-200)"/>
    <rect x="16" y="40" width="180" height="96" rx="10" fill="none"
          stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.5"/>
    <text x="106" y="66" textAnchor="middle" fontSize="14" fontWeight="800"
          fill="var(--ifm-font-color-base)">Registry</text>
    <text x="106" y="90" textAnchor="middle" fontSize="11.5"
          fill="var(--ifm-color-emphasis-800)">z.B. Docker Hub</text>
    <text x="106" y="112" textAnchor="middle" fontSize="11.5"
          fill="var(--ifm-color-emphasis-800)">das Regal mit den</text>
    <text x="106" y="128" textAnchor="middle" fontSize="11.5"
          fill="var(--ifm-color-emphasis-800)">fertigen Vorlagen</text>
  </g>

  <path d="M200 88 L252 88" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <polygon points="260,88 248,82 248,94" fill="var(--ifm-color-emphasis-600)"/>
  <text x="230" y="78" textAnchor="middle" fontSize="11" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">pull</text>

  <g>
    <rect x="264" y="40" width="176" height="96" rx="10"
          fill="var(--ifm-color-emphasis-200)"/>
    <rect x="264" y="40" width="176" height="96" rx="10" fill="none"
          stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.5"/>
    <text x="352" y="66" textAnchor="middle" fontSize="14" fontWeight="800"
          fill="var(--ifm-font-color-base)">Image</text>
    <text x="352" y="90" textAnchor="middle" fontSize="11.5"
          fill="var(--ifm-color-emphasis-800)">die Vorlage</text>
    <text x="352" y="112" textAnchor="middle" fontSize="11.5"
          fill="var(--ifm-color-emphasis-800)">unveränderlich,</text>
    <text x="352" y="128" textAnchor="middle" fontSize="11.5"
          fill="var(--ifm-color-emphasis-800)">liegt auf der Platte</text>
  </g>

  <path d="M444 88 L496 88" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <polygon points="504,88 492,82 492,94" fill="var(--ifm-color-emphasis-600)"/>
  <text x="474" y="78" textAnchor="middle" fontSize="11" fontFamily="var(--ifm-font-family-monospace)"
        fill="var(--ifm-color-emphasis-800)">run</text>

  <g>
    <rect x="524" y="28" width="170" height="40" rx="8"
          fill="var(--ifm-color-success-contrast-background)"/>
    <rect x="524" y="28" width="170" height="40" rx="8" fill="none"
          stroke="var(--ifm-color-success-dark)"/>
    <text x="609" y="53" textAnchor="middle" fontSize="12.5" fontWeight="700"
          fill="var(--ifm-font-color-base)">Container 1</text>

    <rect x="524" y="76" width="170" height="40" rx="8"
          fill="var(--ifm-color-success-contrast-background)"/>
    <rect x="524" y="76" width="170" height="40" rx="8" fill="none"
          stroke="var(--ifm-color-success-dark)"/>
    <text x="609" y="101" textAnchor="middle" fontSize="12.5" fontWeight="700"
          fill="var(--ifm-font-color-base)">Container 2</text>

    <text x="609" y="136" textAnchor="middle" fontSize="11.5"
          fill="var(--ifm-color-emphasis-800)">laufende Prozesse</text>
  </g>

  <text x="360" y="172" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Aus einer Vorlage entstehen beliebig viele laufende Container.</text>
</svg>

:::tip Die Brücke zu dem, was du schon kennst
**Image verhält sich zu Container wie Klasse zu Objekt.**

Die Klasse `Article` beschreibt, was ein Artikel ist — sie liegt einmal im Projekt und ändert sich nicht, während das Programm läuft. Mit `new Article()` entstehen daraus beliebig viele Objekte, jedes mit eigenem Zustand.

Genauso: Das Image `postgres:17.6` beschreibt eine PostgreSQL-Installation. Mit `docker run` entstehen daraus beliebig viele Container, jeder mit eigenen Daten.

Und wie beim Objekt gilt: **Was du im Container änderst, ändert das Image nicht.** Löschst du den Container, ist die Änderung weg — es sei denn, du hast sie in ein Volume geschrieben (siehe unten).
:::

## Was ein Anwendungsentwickler wissen muss

Du wirst in der Ausbildung selten Images bauen. Du wirst aber ständig welche **benutzen** — für Datenbanken, Message-Broker, Testumgebungen. Dafür reicht ein überschaubarer Vorrat an Wissen.

### 1. Der Tag ist Teil des Namens

```text
postgres:17.6
└──┬───┘ └─┬─┘
   │       └── Tag: die Version
   └────────── Name des Images
```

:::warning `latest` ist keine Version
`postgres:latest` bedeutet nicht „die neueste", sondern „das Image, das zuletzt mit diesem Tag versehen wurde". Es zeigt heute auf Version 17 und in einem Jahr auf 18 — ohne dass sich in deinem Projekt eine Zeile ändert.

Dann läuft es bei dir noch und beim Kollegen nicht mehr. Genau der Satz, den Docker abschaffen sollte.

**Immer eine feste Version angeben.**
:::

### 2. Ports werden durchgereicht

Ein Container ist abgeschottet — auch im Netzwerk. Damit du von außen hineinkommst, musst du einen Port **veröffentlichen**:

```yaml
ports:
  - "5432:5432"
#    ^^^^ ^^^^
#    │    └── Port IM Container
#    └─────── Port auf DEINEM Rechner
```

Die linke Zahl kannst du frei wählen, die rechte ist durch das Programm im Container vorgegeben. Ist der Port auf deinem Rechner schon belegt — weil dort bereits eine PostgreSQL läuft —, meldet Docker `port is already allocated`. Dann änderst du die **linke** Zahl, etwa auf `5433:5432`, und trägst dieselbe Zahl in deiner Anwendungskonfiguration ein.

### 3. Container sind vergesslich — Volumes nicht

Alles, was ein Container in sein eigenes Dateisystem schreibt, verschwindet mit ihm. Für eine Datenbank wäre das fatal.

Ein **Volume** ist ein Stück Speicher, das **außerhalb** des Containers liegt und hineingereicht wird:

```yaml
volumes:
  - webshop-data:/var/lib/postgresql/data
#    ^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^
#    │           └── Ort IM Container
#    └────────────── Name des Volumes
```

| Befehl | Was mit den Daten passiert |
|---|---|
| `docker compose stop` | Container hält an, Daten bleiben |
| `docker compose down` | Container wird gelöscht, **Volume bleibt** |
| `docker compose down -v` | Container **und Volume** werden gelöscht — die Daten sind weg |

:::danger `-v` ist keine Kleinigkeit
Das `-v` in `docker compose down -v` löscht die Datenbank. Nicht die Tabellen — den ganzen Inhalt.

Im Unterricht ist das oft genau das, was du willst: sauber von vorn anfangen. Im Betrieb ist es der Befehl, nach dem man das Backup braucht.
:::

### 4. Die Befehle, die du wirklich brauchst

```bash
docker compose up -d      # startet alles aus der docker-compose.yml, im Hintergrund
docker compose ps         # was läuft gerade?
docker compose logs -f    # was sagt der Container? (-f = mitlaufen lassen)
docker compose stop       # anhalten, Daten bleiben
docker compose down       # anhalten und Container löschen
```

Das `-d` steht für *detached*: Der Container läuft weiter, auch wenn du das Terminal schließt. Ohne `-d` blockiert der Container dein Terminal und stirbt mit ihm.

:::tip Wenn etwas nicht geht, lies die Logs
`docker compose logs` ist das erste Mittel bei jedem Problem. Eine Datenbank, die nicht startet, sagt dort, warum — meist in der letzten oder vorletzten Zeile.

Der zweite Blick gilt `docker compose ps`: Steht dort `Up (healthy)`, läuft der Container und antwortet. Steht dort `Exit 1`, ist er gestartet und sofort wieder gestorben.
:::

### 5. Die Datei, die alles zusammenhält

Ein einzelner Container lässt sich mit `docker run` starten. Sobald mehrere zusammenspielen — Anwendung, Datenbank, vielleicht ein Cache —, schreibt man sie in eine **`docker-compose.yml`**. Diese Datei gehört ins Projekt und in die Versionsverwaltung: Sie ist die Beschreibung der Umgebung, und damit Teil des Quelltextes.

Genau so eine Datei benutzt du im [Webshop-Tutorial](/tutorial-04/):

```yaml title="docker-compose.yml"
services:
  webshop-db:
    image: postgres:17.6
    container_name: webshop-db
    environment:
      POSTGRES_DB: webshop
      POSTGRES_USER: webshop
      POSTGRES_PASSWORD: geheim
    ports:
      - "5432:5432"
    volumes:
      - webshop-data:/var/lib/postgresql/data

volumes:
  webshop-data:
```

| Abschnitt | Bedeutung |
|---|---|
| `services` | Die Container, die zusammen eine Umgebung bilden |
| `image` | Welche Vorlage — mit Version |
| `environment` | Einstellungen, die beim Start hineingereicht werden |
| `ports` | Was von außen erreichbar sein soll |
| `volumes` | Wo die Daten liegen, die den Container überleben |

Dass Zugangsdaten hier im Klartext stehen, ist für eine Übungsumgebung in Ordnung. Im Betrieb kommen sie aus Umgebungsvariablen oder einem Geheimnisspeicher — nie aus einer Datei im Repository.

## Wie ein Image entsteht

Auch wenn du selten eines baust: Du solltest ein **Dockerfile** lesen können. Es ist eine Bauanleitung, Zeile für Zeile.

```dockerfile title="Dockerfile"
FROM eclipse-temurin:26-jre
WORKDIR /app
COPY target/webshop-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

| Anweisung | Bedeutung |
|---|---|
| `FROM` | Auf welchem Image wird aufgebaut — hier eine Java-Laufzeitumgebung |
| `WORKDIR` | In welchem Verzeichnis wird gearbeitet |
| `COPY` | Was aus dem Projekt kommt mit hinein |
| `EXPOSE` | Welchen Port das Programm im Container benutzt (Dokumentation) |
| `ENTRYPOINT` | Was beim Start ausgeführt wird |

Jede Anweisung erzeugt eine **Schicht**. Ändert sich eine Zeile, werden nur sie und die darunter neu gebaut — deshalb steht das, was sich selten ändert, oben.

Dass eine Spring-Boot-Anwendung ihren Webserver eingebaut mitbringt (siehe [Tutorial 01](/tutorial-01/01-projekt-aufsetzen)), passt genau dazu: Eine einzige `.jar`-Datei, ein `java -jar`, fertig. Genau deshalb lassen sich Spring-Boot-Anwendungen so gut in Container packen.

## Wozu das Ganze — jenseits des Klassenraums

| Anwendungsfall | Was Docker beiträgt |
|---|---|
| **Entwicklungsumgebung** | Jede neue Kollegin ist in Minuten arbeitsfähig: Repository klonen, `docker compose up`, fertig |
| **Testen** | Jeder Testlauf startet mit einer frischen, immer gleichen Datenbank |
| **Ausliefern** | Was getestet wurde, wird ausgeliefert — dasselbe Image, nicht ein neu gebautes |
| **Betrieb** | Mehrere Anwendungen auf einem Server, ohne dass sich ihre Bibliotheken in die Quere kommen |
| **Skalieren** | Von einem Container auf zehn, ohne dass jemand etwas installiert |

Der letzte Punkt ist der Grund, warum Docker und [Microservices](/infoblaetter/microservices) fast immer zusammen genannt werden: Wer viele kleine Dienste betreibt, braucht eine Verpackung, die sich schnell und einheitlich vervielfältigen lässt.

:::note Und was ist Kubernetes?
Docker startet Container auf **einem** Rechner. Sobald ein System auf vielen Rechnern läuft, braucht es jemanden, der entscheidet, welcher Container wo läuft, ihn neu startet, wenn er abstürzt, und den Verkehr verteilt.

Das ist die Aufgabe eines **Orchestrators**, und der verbreitetste heißt **Kubernetes**. Für die Ausbildung reicht es zu wissen, dass es ihn gibt und wozu — bedienen wirst du ihn frühestens im Betrieb.
:::

## Filme

Zum Ansehen statt Lesen — beide auf Deutsch:

| Film | Wofür |
|---|---|
| [Was ist Docker?](https://www.youtube.com/watch?v=sokNzEFt_k0) (the native web) | Der Einstieg: Warum es Container gibt und was sie von VMs unterscheidet |
| [DOCKER Crashkurs — in 20 Minuten](https://www.youtube.com/watch?v=tTdNMMExjZI) (Coding Crashkurse) | Die Praxis: Images, Volumes, Compose zum Mitmachen |

Wer tiefer einsteigen will: [Docker lernen — Eine Einführung in 100 Minuten](https://www.youtube.com/watch?v=DESdVoKhIxY) vom selben Kanal wie der erste Film.

## Das Wichtigste in Kürze

- Ein **Container** ist ein abgeschotteter Prozess, **keine** virtuelle Maschine — er teilt sich den Betriebssystemkern mit allen anderen.
- **Image** ist die Vorlage, **Container** die laufende Instanz — wie Klasse und Objekt.
- Immer eine **feste Version** angeben, nie `latest`.
- `ports` reicht einen Port nach außen: **links** dein Rechner, **rechts** der Container.
- Daten überleben nur in einem **Volume**. `down -v` löscht es.
- Die `docker-compose.yml` beschreibt die Umgebung und gehört **ins Repository**.
- Bei Problemen: erst `docker compose ps`, dann `docker compose logs`.

## Weiterlesen

- [Microservices](/infoblaetter/microservices) — warum Container und viele kleine Dienste zusammengehören
- [Maven und Abhängigkeiten](/infoblaetter/maven) — dieselbe Grundfrage auf der Ebene der Bibliotheken: Wer sorgt dafür, dass überall dasselbe läuft?
- [Webshop-Tutorial](/tutorial-04/) — dort startest du deine erste Datenbank im Container
