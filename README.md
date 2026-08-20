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
| `website/` | Die gesamte Website (Docusaurus) — alle Tutorials und Infoblätter |
| `01-personenverwaltung/` | Lauffähiges Referenzprojekt zu Tutorial 1 (Spring Boot 4.1, Java 25) |
| `02-gaestebuch/` | Lauffähiges Referenzprojekt zu Tutorial 2 |
| `_screenshots/` | Screenshots und die Skripte, mit denen sie erzeugt werden |
| `.github/workflows/` | Pipeline für die Veröffentlichung |

Innerhalb von `website/`:

| | |
|---|---|
| `tutorials.js` | **Hier wird freigeschaltet** — siehe unten |
| `docs-infoblaetter/` | Die Infoblätter, genau einmal. Immer erreichbar. |
| `docs-tutorial-01/` | Arbeitsblätter von Tutorial 1 |
| `docs-tutorial-02/` | Arbeitsblätter von Tutorial 2 |
| `src/pages/index.js` | Startseite |

---

## Tutorials freischalten

Die Schüler sollen nicht alle Tutorials gleichzeitig bekommen. Gesteuert wird
das in **`website/tutorials.js`**:

```js
{ id: 'tutorial-02', titel: 'Gästebuch', veroeffentlicht: false }
```

- `false` → Das Tutorial wird **gar nicht gebaut**. Die Adresse liefert einen
  `404`, auch für jemanden, der sie errät. Weder Inhalt noch Titel stehen
  irgendwo im Ergebnis.
- `true` → Es erscheint auf der Startseite und in der Navigationsleiste.

Umschalten, committen, pushen — nach etwa zwei Minuten ist es online.

Die **Infoblätter sind nicht geschaltet**. Sie sind Nachschlagematerial und
immer erreichbar. Das heißt auch: Wer in Tutorial 1 steckt, sieht im
Verzeichnis bereits *Lombok* und *Abgeleitete Abfragen*. Das ist gewollt —
Nachschlagen ist etwas anderes, als die Arbeitsblätter vorab zu bekommen.

---

## Lokal arbeiten

Voraussetzung: **Node 22 oder neuer**.

```bash
cd website
npm install
npm run start
```

`npm run start` startet den Entwicklungsserver mit automatischem Neuladen auf
Port 3000. Nicht freigeschaltete Tutorials fehlen auch hier — zum Bearbeiten
also vorübergehend in `tutorials.js` auf `true` setzen.

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

## Drei Dinge, die man wissen muss

### 1. Verweise zwischen den Bereichen absolut schreiben

Jedes Tutorial und die Infoblätter sind eigene Docusaurus-Doku-Bereiche.
Verweise über eine Bereichsgrenze hinweg müssen deshalb **absolut** sein:

| | |
|---|---|
| `[HTTP kompakt](/infoblaetter/http-kompakt)` | richtig |
| `[HTTP kompakt](../infoblaetter/http-kompakt)` | bricht den Build ab |

Innerhalb eines Bereichs bleibt der Dateiname ohne Pfad, etwa
`[Projekt aufsetzen](01-projekt-aufsetzen)`.

Kaputte Links lassen den Build absichtlich scheitern (`onBrokenLinks: 'throw'`)
— sie fallen also sofort auf und nicht erst auf der veröffentlichten Seite.

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

### 3. In SVG-Diagrammen darf `<text>` nur ein Kind haben

Die Diagramme in den Arbeits- und Infoblättern sind handgezeichnetes SVG,
direkt im Markdown. Dabei gibt es eine Falle, die **ohne Fehlermeldung**
zuschlägt: Ein `<text>`-Element rendert nur, wenn es **genau ein** Kind hat.

Sobald sich Text und ein JSX-Ausdruck mischen — oder der Inhalt über mehrere
Zeilen verteilt ist — erscheint die Zeile im fertigen Bild **gar nicht**.
Der Build läuft trotzdem grün durch.

```jsx
{/* ❌ rendert nichts: Text und Ausdruck gemischt */}
<text x="20" y="40">{"{"} "id": 1,</text>

{/* ❌ rendert nichts: Inhalt über mehrere Zeilen */}
<text x="20" y="40">
  das Feld ist final
</text>

{/* ✅ genau ein Textknoten */}
<text x="20" y="40">das Feld ist final</text>

{/* ✅ genau ein Ausdruck — so schreibt man Zeichen wie { } */}
<text x="20" y="40">{'{ "id": 1,'}</text>
```

Weitere Konventionen für diese Diagramme:

- Farben immer über die Docusaurus-Variablen (`var(--ifm-color-primary)`,
  `var(--ifm-color-emphasis-300)` …), damit Hell- und Dunkelmodus funktionieren.
- **Ausnahme:** Text auf farbigen Flächen — etwa eine Ziffer in einem grünen
  Kreis — bekommt `fill="#ffffff"`. `var(--ifm-background-color)` greift dort
  im Hellmodus nicht.
- JSX-Schreibweise beachten: `strokeWidth`, `textAnchor`, `fontSize`,
  `strokeDasharray` — nicht die Bindestrich-Varianten.
- Jedes Diagramm bekommt `role="img"` und ein `aria-label`.

**Immer nachsehen, nicht nur bauen.** Ob ein Diagramm wirklich stimmt, zeigt nur
das gerenderte Bild:

```bash
cd _screenshots
node infoblaetter.mjs          # alle Infoblätter, hell und dunkel
node infoblaetter.mjs json     # nur ein bestimmtes
```

Das Skript erwartet eine laufende Vorschau unter den Produktiv-Pfaden
(siehe Kommentar im Skript).

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
