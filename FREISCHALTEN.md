# Tutorials freischalten und wieder abschalten

Für **Sören Schwerk**, Repository `Soeren2208/lf08-rest-apis`.

Alles läuft im Browser. Kein Clone, kein lokaler Build, kein Commit. Es geht
auch vom Handy aus.

---

## ⚠️ Zuerst: die Reihenfolge beim allerersten Mal

Diese Anleitung beschreibt den Stand **nach** dem nächsten Push. Auf GitHub
liegt derzeit noch die alte Fassung, die die Variable gar nicht kennt.

Halte deshalb genau diese Reihenfolge ein:

1. **Variable `TUTORIALS` anlegen** — siehe *Einmalige Einrichtung* unten.
   Setze sie auf den Stand, der jetzt öffentlich ist: `tutorial-01`
2. **Erst danach** die neuen Änderungen committen und pushen.

**Andersherum schlägt der erste Lauf fehl.** Der neue Ablauf bricht bewusst ab,
wenn die Variable fehlt — lieber ein roter Lauf als eine Seite, die
versehentlich alles veröffentlicht. Ein Fehlschlag ist harmlos: Die
bestehende Seite bleibt unverändert online. Lege dann die Variable nach und
starte den Lauf erneut.

---

## Wie es funktioniert (einmal lesen, dann nie wieder)

Welche Tutorials veröffentlicht werden, steht in **einer einzigen Variablen**
auf GitHub — nicht im Quelltext. Sie heißt `TUTORIALS` und enthält eine
kommagetrennte Liste:

```
tutorial-01,tutorial-02
```

Was dort **nicht** steht, wird gar nicht erst gebaut. Die Adresse liefert dann
einen echten `404` — auch für jemanden, der sie errät. Es gibt keine versteckte
Seite, die man nur nicht verlinkt hat.

Nach jeder Änderung der Variablen muss die Seite **einmal neu gebaut** werden.
Das ist der zweite Schritt in jeder Anleitung unten.

> **Die Infoblätter sind nie geschaltet.** Sie sind Nachschlagematerial und
> immer erreichbar.

---

## Einmalige Einrichtung

Das ist **nur beim allerersten Mal** nötig. Danach nie wieder.

1. Gehe zu <https://github.com/Soeren2208/lf08-rest-apis>
2. Oben im Reitermenü auf **Settings**
3. Links in der Leiste: **Secrets and variables** → darunter **Actions**
4. Oben den Reiter **Variables** wählen (nicht *Secrets*!)
5. Knopf **New repository variable**
6. Ausfüllen:

   | Feld | Wert |
   |---|---|
   | **Name** | `TUTORIALS` |
   | **Value** | `tutorial-01` |

7. **Add variable**

Damit ist der Stand: Nur Tutorial 1 ist öffentlich. Genau wie bisher.

> **Warum keine leere Variable?** Ist `TUTORIALS` nicht gesetzt oder leer,
> **bricht der Build ab** — mit einem Hinweis, wo die Variable anzulegen ist.
> Das ist Absicht: Alles zu veröffentlichen wäre die gefährlichere Vermutung.

---

## Tutorial 2 freischalten

**Schritt 1 — Variable ändern**

1. <https://github.com/Soeren2208/lf08-rest-apis/settings/variables/actions>
2. In der Zeile `TUTORIALS` rechts auf das **Stift-Symbol**
3. Den Wert ersetzen durch:

   ```
   tutorial-01,tutorial-02
   ```

   Keine Leerzeichen nötig, sie stören aber auch nicht.
4. **Update variable**

**Schritt 2 — Seite neu bauen lassen**

1. Oben im Reitermenü auf **Actions**
2. Links in der Liste auf **Website bauen und veröffentlichen**
3. Rechts der Knopf **Run workflow** → im aufklappenden Feld nochmals
   **Run workflow**
4. Warten. Der Lauf dauert etwa zwei Minuten.

**Schritt 3 — nachsehen**

Ein grüner Haken bedeutet: veröffentlicht.

Öffne <https://soeren2208.github.io/lf08-rest-apis/> — Tutorial 2 steht jetzt
in der Navigationsleiste und auf der Startseite.

> Falls die Seite noch den alten Stand zeigt: einmal mit `Strg`+`F5` neu laden.
> Der Browser hält die alte Fassung sonst gerne fest.

---

## Tutorial 3 freischalten

Genau dasselbe, nur mit einem längeren Wert.

**Schritt 1** — Variable auf diesen Wert setzen:

```
tutorial-01,tutorial-02,tutorial-03
```

**Schritt 2** — Actions → *Website bauen und veröffentlichen* → **Run workflow**

**Schritt 3** — nachsehen unter
<https://soeren2208.github.io/lf08-rest-apis/tutorial-03/>

---

## Ein Tutorial wieder abschalten

Dieselben zwei Schritte, nur rückwärts: Den Eintrag aus der Liste **entfernen**.

Soll Tutorial 3 wieder verschwinden:

```
tutorial-01,tutorial-02
```

Danach wieder **Run workflow**. Nach etwa zwei Minuten liefert
`…/tutorial-03/` einen `404`.

> **Was passiert mit den Häkchen der Schüler?** Nichts. Abgehakte Aufgaben und
> ausgefüllte Tabellen liegen im Browser des Schülers, nicht auf dem Server.
> Wird ein Tutorial später wieder freigeschaltet, ist der alte Stand wieder da
> — sofern derselbe Rechner und derselbe Browser benutzt werden.

---

## Alle Werte auf einen Blick

| Gewünschter Stand | Wert von `TUTORIALS` |
|---|---|
| nur Personenverwaltung | `tutorial-01` |
| + Gästebuch | `tutorial-01,tutorial-02` |
| + Testen | `tutorial-01,tutorial-02,tutorial-03` |
| nur das Gästebuch (z. B. für eine Wiederholungsstunde) | `tutorial-02` |

Die Reihenfolge in der Liste spielt keine Rolle — die Anordnung auf der Seite
richtet sich nach der Nummer des Tutorials.

---

## Wenn etwas schiefgeht

| Symptom | Ursache | Abhilfe |
|---|---|---|
| Der Lauf hat ein **rotes X** und meldet *„Die Variable TUTORIALS ist nicht gesetzt"* | Variable fehlt oder ist leer | Einmalige Einrichtung oben durchführen |
| Rotes X mit *„TUTORIALS nennt unbekannte Ids"* | Tippfehler, z. B. `tutorial-2` statt `tutorial-02` | Wert korrigieren, erneut **Run workflow** |
| Grüner Haken, aber die Seite ändert sich nicht | Browser zeigt den alten Stand | `Strg`+`F5` |
| Grüner Haken, Tutorial fehlt trotzdem | Die Variable wurde geändert, aber der Lauf davor gestartet | Erneut **Run workflow** — die Variable wird beim **Start** des Laufs gelesen |

Beim rot markierten Lauf zeigt ein Klick auf den Schritt **Bauen** die
vollständige Meldung. Der Text nennt jedes Mal, was zu tun ist.

---

## Was das Ganze *nicht* kann

Es gibt genau **eine** Freigabe pro Repository. Diese Anleitung schaltet also
für **alle** frei, die auf `soeren2208.github.io/lf08-rest-apis/` schauen.

Wer eigene Zeitpunkte braucht, braucht eine eigene Veröffentlichung — dafür
gibt es die Anleitung [`FUER-KOLLEGEN.md`](FUER-KOLLEGEN.md).
