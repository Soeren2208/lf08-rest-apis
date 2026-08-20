"""Schneidet Browser-Screenshots unten ab, wo nur noch leere Flaeche folgt.

Vorgehen: Von unten nach oben die Zeilen pruefen. Eine Zeile gilt als leer,
wenn alle ihre Pixel (fast) derselben Farbe entsprechen wie das linke Randpixel.
Die letzte nicht-leere Zeile plus Rand ist die neue Bildhoehe.
"""
import os
import sys
from PIL import Image

ORDNER = r"C:\Users\sschw\Lernfeld 8\Lernsituationen\02 REST-APIs erstellen\Neuentwicklung\_screenshots"

# Nur die Bilder mit Browser-/Konsolenausgabe
DATEIEN = [
    "02-welcome.png",
    "03-persons.png",
    "04-problem-404.png",
    "05-actuator-health.png",
    "06-h2-login.png",
    "07-h2-query.png",
]

RAND = 40          # Pixel Luft unterhalb des letzten Inhalts
TOLERANZ = 12      # Farbabweichung, ab der ein Pixel als Inhalt gilt
MIN_HOEHE = 120    # Sicherheitsnetz: niemals kleiner zuschneiden


def letzte_inhaltszeile(img):
    px = img.convert("RGB").load()
    b, h = img.size
    # In Schritten von 2 Pixeln abtasten - schnell genug und ausreichend genau
    for y in range(h - 1, -1, -1):
        ref = px[0, y]
        for x in range(0, b, 2):
            r, g, bl = px[x, y]
            if (abs(r - ref[0]) > TOLERANZ or abs(g - ref[1]) > TOLERANZ
                    or abs(bl - ref[2]) > TOLERANZ):
                return y
    return h - 1


def main():
    if not os.path.isdir(ORDNER):
        print("Ordner nicht gefunden:", ORDNER)
        sys.exit(1)

    for name in DATEIEN:
        pfad = os.path.join(ORDNER, name)
        if not os.path.exists(pfad):
            print("%-24s uebersprungen (nicht vorhanden)" % name)
            continue

        img = Image.open(pfad)
        breite, hoehe = img.size
        y = letzte_inhaltszeile(img)
        neu = max(MIN_HOEHE, min(hoehe, y + RAND))

        if neu >= hoehe - 5:
            print("%-24s %dx%d  unveraendert (kein leerer Bereich)" % (name, breite, hoehe))
            img.close()
            continue

        img.crop((0, 0, breite, neu)).save(pfad)
        img.close()
        print("%-24s %dx%d  ->  %dx%d   (%d%% gespart)"
              % (name, breite, hoehe, breite, neu, round((1 - neu / hoehe) * 100)))


if __name__ == "__main__":
    main()
