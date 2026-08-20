# REST-APIs mit Spring Boot — Lernsituationen LF8

Unterrichtsmaterial für den Bildungsgang **Fachinformatiker/in – Anwendungsentwicklung**
am Schulzentrum Utbremen, Bremen.

**Veröffentlichte Seite:** https://soeren2208.github.io/lf08-rest-apis/

| | Adresse |
|---|---|
| Startseite | https://soeren2208.github.io/lf08-rest-apis/ |
| Tutorial 1 – Personenverwaltung | https://soeren2208.github.io/lf08-rest-apis/tutorial-01/ |
| Tutorial 2 – Gästebuch | https://soeren2208.github.io/lf08-rest-apis/tutorial-02/ |

---

## Was hier liegt

| Ordner | Inhalt |
|---|---|
| `website/` | Tutorial 1 – Personenverwaltung (Docusaurus) |
| `website-02-gaestebuch/` | Tutorial 2 – Gästebuch-Microservice (Docusaurus) |
| `01-personenverwaltung/` | Lauffähiges Referenzprojekt zu Tutorial 1 (Spring Boot 4.1, Java 25) |
| `02-gaestebuch/` | Lauffähiges Referenzprojekt zu Tutorial 2 |
| `landing/` | Statische Startseite, die auf beide Tutorials verweist |
| `_screenshots/` | Screenshots und die Skripte, mit denen sie erzeugt werden |
| `.github/workflows/` | Pipeline für die Veröffentlichung |

---

## Lokal arbeiten

Voraussetzung: **Node 22 oder neuer**.

```bash
cd website              # oder website-02-gaestebuch
npm install
npm run start
```

`npm run start` startet den Entwicklungsserver mit automatischem Neuladen.
Tutorial 1 läuft auf Port 3000; für Tutorial 2 parallel:

```bash
cd website-02-gaestebuch
npm run start -- --port 3001
```

Vor dem Push lohnt sich ein vollständiger Build, weil die Pipeline denselben ausführt:

```bash
npm run build
```

Der Build bricht bei **kaputten internen Links** ab (`onBrokenLinks: 'throw'`) — das ist Absicht.

---

## Veröffentlichen

Es ist **nichts von Hand zu tun**. Jeder Push auf `main` startet die Pipeline
(`.github/workflows/deploy.yml`). Sie baut beide Websites, setzt sie mit der
Startseite zu einer Seite zusammen und veröffentlicht sie auf GitHub Pages.

Der Stand einer Veröffentlichung ist unter *Actions* im Repository einzusehen.
Ein Durchlauf dauert rund zwei bis drei Minuten.

---

## Zusammenarbeit

Empfohlener Ablauf:

```bash
git pull
git switch -c meine-aenderung     # Zweig anlegen
# ... arbeiten, npm run build zur Kontrolle ...
git add -A
git commit -m "Kurze Beschreibung"
git push -u origin meine-aenderung
```

Danach auf GitHub einen Pull Request stellen. Wer direkt auf `main` arbeitet,
löst sofort eine Veröffentlichung aus — das ist möglich, aber ungeprüft.

---

## Zwei Dinge, die man wissen muss

### 1. Die Infoblätter liegen doppelt

Sieben Infoblätter (Webservices, REST, HTTP, JSON, Maven, JPA/Hibernate,
Testfälle) existieren **in beiden** Website-Ordnern, damit jedes Tutorial für
sich vollständig ist. Wer eines davon ändert, muss es in beiden Ordnern tun.

Hinweise dazu stehen in `website-02-gaestebuch/INFOBLAETTER-SYNC.md`.

### 2. `future.v4` darf nicht aktiviert werden

In `docusaurus.config.js` steht:

```js
future: {
  v4: false,
}
```

Mit `v4: true` werden **Admonitions** (`:::info`, `:::tip`, `:::warning` …) nicht
mehr geparst und erscheinen als roher Text mit sichtbaren Doppelpunkten.
Nachgewiesen mit Docusaurus 3.10.2. Bitte nicht umstellen, ohne das zu prüfen.

---

## Referenzprojekte ausführen

Beide Spring-Boot-Projekte laufen mit dem mitgelieferten Maven Wrapper —
ein lokal installiertes Maven ist nicht nötig.

```bash
cd 01-personenverwaltung
mvnw.cmd spring-boot:run        # Windows
./mvnw spring-boot:run          # Linux, macOS
```

Erreichbar unter `http://localhost:8080`. Beim Gästebuch zusätzlich die
API-Dokumentation unter `http://localhost:8080/swagger-ui.html`.

---

## Screenshots neu erzeugen

Nach einem Versionswechsel von Spring Boot oder IntelliJ:

```bash
cd _screenshots
node shots.mjs        # erzeugt die Browser-Screenshots neu
python zuschnitt.py   # schneidet leere Flächen unten ab
```

Die IntelliJ-Screenshots (`ij-*.png`) sind von Hand aufgenommen und werden
davon nicht berührt.

---

## Stand der Technik

| | Version |
|---|---|
| Spring Boot | 4.1.0 |
| Java | 25 (LTS) |
| Hibernate | 7.4 |
| Docusaurus | 3.10.2 |
| springdoc-openapi | 3.1.0 (Tutorial 2) |

---

## Lizenz und Nutzung

Unterrichtsmaterial für den schulischen Gebrauch. Keine kommerzielle Nutzung.
