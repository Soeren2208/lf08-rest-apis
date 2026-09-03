# Eigene Ausgabe der Tutorials — Anleitung für Kolleginnen und Kollegen

Diese Anleitung richtet dir eine **eigene Veröffentlichung** desselben
Unterrichtsmaterials ein. Du bekommst:

- deine **eigene Adresse** unter deinem GitHub-Namen
- deine **eigenen Freischaltungstermine** — unabhängig von allen anderen
- **denselben Inhalt**, den du mit einem Klick aktuell hältst

Verbesserungen am Material bleiben gemeinsam. Nur die Frage *„wann sehen meine
Schüler was?"* beantwortest du für deine Klasse allein.

Alles läuft im Browser. Nichts wird lokal installiert.

---

## Warum ein Fork und nicht einfach dieselbe Seite?

Eine Webseite kann immer nur **einen** Stand zeigen. Schaltet Sören Tutorial 3
frei, wäre es auch für deine Klasse da — und umgekehrt.

Zwei unterschiedliche Zeitpunkte brauchen deshalb zwei Veröffentlichungen. Ein
**Fork** ist eine Kopie des Repositories in deinem Konto, die mit dem Original
verbunden bleibt: Inhalte kannst du dir jederzeit nachholen, deine Freigabe
gehört dir allein.

---

## Teil A — Einmalige Einrichtung

Etwa zehn Minuten. Danach kostet jede Freischaltung eine Minute.

### Schritt 1 — Fork anlegen

1. Gehe zu <https://github.com/Soeren2208/lf08-rest-apis>
2. Oben rechts auf **Fork**
3. Die Voreinstellungen passen. Wichtig ist nur:
   - **Owner**: dein eigener Benutzername
   - **Repository name**: `lf08-rest-apis` **so lassen**
   - Der Haken bei *„Copy the `main` branch only"* darf gesetzt bleiben
4. **Create fork**

Nach ein paar Sekunden liegt die Kopie unter
`https://github.com/DEIN-NAME/lf08-rest-apis`.

> **Warum den Namen nicht ändern?** Die Adresse der späteren Webseite entsteht
> aus dem Repository-Namen. Bei `lf08-rest-apis` lautet sie
> `https://DEIN-NAME.github.io/lf08-rest-apis/`. Ein anderer Name geht auch —
> die Adresse ändert sich dann entsprechend mit.

### Schritt 2 — Actions einschalten

GitHub schaltet automatische Abläufe in einem frischen Fork zur Sicherheit ab.

1. In **deinem** Fork oben auf den Reiter **Actions**
2. Es erscheint ein gelber Hinweis mit dem Knopf
   **I understand my workflows, go ahead and enable them**
3. Draufklicken.

### Schritt 3 — GitHub Pages einschalten

1. Oben auf **Settings**
2. Links in der Leiste: **Pages**
3. Unter **Build and deployment** → **Source** den Eintrag
   **GitHub Actions** wählen

   *(Nicht „Deploy from a branch". Wenn dort schon „GitHub Actions" steht,
   ist nichts zu tun.)*

### Schritt 4 — Die Freigabe-Variable anlegen

Hier legst du fest, welche Tutorials **deine** Klasse sieht.

1. Immer noch unter **Settings**
2. Links: **Secrets and variables** → darunter **Actions**
3. Oben den Reiter **Variables** wählen (nicht *Secrets*!)
4. Knopf **New repository variable**
5. Ausfüllen:

   | Feld | Wert |
   |---|---|
   | **Name** | `TUTORIALS` |
   | **Value** | `tutorial-01` |

6. **Add variable**

> Setze hier den Stand ein, mit dem du **starten** willst. `tutorial-01` ist
> der übliche Anfang. Was nicht in der Liste steht, wird nicht gebaut und
> liefert einen `404`.

### Schritt 5 — Zum ersten Mal veröffentlichen

1. Oben auf **Actions**
2. Links in der Liste auf **Website bauen und veröffentlichen**
3. Rechts **Run workflow** → im aufklappenden Feld nochmals **Run workflow**
4. Warten, etwa zwei Minuten

Ein grüner Haken bedeutet: fertig. Deine Seite liegt unter

```
https://DEIN-NAME.github.io/lf08-rest-apis/
```

Diese Adresse gibst du deiner Klasse.

> **Du musst nichts am Quelltext ändern** — auch nicht die Adresse. Sie wird
> beim Bauen automatisch aus deinem Repository-Namen gebildet. Genau deshalb
> funktioniert Teil C so bequem.

---

## Teil B — Ein Tutorial freischalten oder abschalten

Zwei Schritte, jedes Mal dieselben.

**Schritt 1 — Variable ändern**

1. `https://github.com/DEIN-NAME/lf08-rest-apis/settings/variables/actions`
2. In der Zeile `TUTORIALS` rechts auf das **Stift-Symbol**
3. Wert setzen:

   | Gewünschter Stand | Wert |
   |---|---|
   | nur Personenverwaltung | `tutorial-01` |
   | + Gästebuch | `tutorial-01,tutorial-02` |
   | + Testen | `tutorial-01,tutorial-02,tutorial-03` |
   | + Webshop | `tutorial-01,tutorial-02,tutorial-03,tutorial-04` |
   | Webshop ohne das Test-Tutorial | `tutorial-01,tutorial-02,tutorial-04` |

   Die Tutorials verlinken einander: 02 verweist auf 01, und 03 wie 04
   verweisen auf 02. Fehlt ein verlinktes Tutorial, bricht der Lauf ab und
   sagt genau, welches fehlt. Das Test-Tutorial (03) ist kein Vorgänger von
   Tutorial 04 und darf weggelassen werden.

4. **Update variable**

**Schritt 2 — Seite neu bauen lassen**

**Actions** → **Website bauen und veröffentlichen** → **Run workflow**

Nach etwa zwei Minuten ist der neue Stand online. Falls der Browser noch das
Alte zeigt: `Strg`+`F5`.

**Abschalten** geht genauso — den Eintrag aus der Liste **entfernen** und
erneut bauen lassen. Danach liefert die Adresse wieder einen `404`.

> Abgehakte Aufgaben und ausgefüllte Tabellen der Schüler liegen in deren
> Browser, nicht auf dem Server. Ein Ab- und späteres Wiedereinschalten
> löscht nichts.

---

## Teil C — Inhaltliche Verbesserungen nachholen

Wird am gemeinsamen Material etwas verbessert — ein korrigierter Tippfehler,
ein neues Infoblatt, ein weiteres Tutorial —, holst du dir das so:

1. Gehe zur Startseite deines Forks:
   `https://github.com/DEIN-NAME/lf08-rest-apis`
2. Über der Dateiliste steht ein Hinweis wie
   *„This branch is 3 commits behind Soeren2208:main"*
3. Rechts daneben: **Sync fork** → **Update branch**
4. Danach **Actions** → **Run workflow**, damit deine Seite neu gebaut wird

Das ist alles. Ein Klick, keine Konflikte.

> **Warum ist das konfliktfrei?** Weil in deinem Fork **keine eigenen Commits**
> liegen. Deine Freigabe steht in der Variablen, nicht im Quelltext, und die
> Adresse wird automatisch gebildet. Solange du keine Dateien änderst, ist jede
> Aktualisierung ein einfaches Vorspulen.
>
> **Deine Variable bleibt dabei unangetastet.** Ein Sync ändert nur Dateien.

---

## Teil D — Wenn du selbst etwas verbessern willst

Sehr willkommen — nur bitte nicht still im eigenen Fork, sonst läuft das
Material auseinander und Teil C fängt an, Konflikte zu melden.

Der Weg:

1. In **deinem** Fork die Datei ändern (der Stift oben rechts in der
   Dateiansicht genügt für Text)
2. Beim Speichern **Create a new branch for this commit** wählen
3. **Propose changes** → **Create pull request**
4. Als Ziel `Soeren2208/lf08-rest-apis` → `main` wählen

Nach dem Übernehmen holst du dir die Änderung wie in Teil C zurück — dann auf
dem gemeinsamen Stand, ohne eigenen Abzweig.

---

## Wenn etwas schiefgeht

| Symptom | Ursache | Abhilfe |
|---|---|---|
| Unter **Actions** steht nur ein gelber Hinweis, keine Abläufe | Actions im Fork noch nicht eingeschaltet | Teil A, Schritt 2 |
| Der Lauf ist rot: *„Die Variable TUTORIALS ist nicht gesetzt"* | Variable fehlt | Teil A, Schritt 4 |
| Der Lauf ist rot: *„TUTORIALS nennt unbekannte Ids"* | Tippfehler, z. B. `tutorial-2` statt `tutorial-02` | Wert korrigieren, erneut bauen |
| Der Lauf ist rot bei *Pages einrichten* oder *Veröffentlichen* | Pages steht nicht auf **GitHub Actions** | Teil A, Schritt 3 |
| Grüner Haken, aber die Adresse liefert `404` | Beim allerersten Mal braucht GitHub Pages ein paar Minuten | Fünf Minuten warten, dann `Strg`+`F5` |
| Die Seite zeigt den alten Stand | Browser-Zwischenspeicher | `Strg`+`F5` |
| **Sync fork** meldet einen Konflikt | Es liegen doch eigene Commits im Fork | Bei Sören melden — meist genügt es, den eigenen Stand zu verwerfen |

Bei einem roten Lauf zeigt ein Klick auf den fehlgeschlagenen Schritt die
vollständige Meldung. Die Fehlertexte dieses Projekts nennen jeweils, was zu
tun ist.

---

## Das Wichtigste in fünf Zeilen

| Was | Wo |
|---|---|
| Deine Seite | `https://DEIN-NAME.github.io/lf08-rest-apis/` |
| Freischalten | Settings → Secrets and variables → Actions → **Variables** → `TUTORIALS` |
| Wirksam machen | Actions → Website bauen und veröffentlichen → **Run workflow** |
| Inhalte nachholen | Startseite des Forks → **Sync fork**, danach erneut bauen |
| Dauer eines Laufs | rund zwei Minuten |
