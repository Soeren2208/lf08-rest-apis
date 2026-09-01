import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

/**
 * PageExplorer — Paginierung zum Anfassen.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   <PageExplorer storageKey="t2-ab03-blaettern" />
 *
 * Warum ein Widget und keine Tabelle: Seitenweises Ausliefern ist ein
 * Schiebefenster ueber einer Liste. Wer die Regler bewegt, sieht das
 * Fenster wandern und kuerzer werden - das laesst sich mit einer
 * Feldtabelle nicht zeigen.
 *
 * Vor den Reglern steht eine Vorhersage. Ein Widget, an dem man nur
 * herumschiebt, ist eine Vorfuehrung und kein Lernmittel; erst der
 * Abgleich zwischen Erwartung und Wirklichkeit bringt etwas.
 */

const GESAMT = 12;
const GROESSTE_SEITE = 6;

/** Die Aufgabe, die vor dem Freischalten steht. */
const FRAGE = {
  size: 5,
  page: 1,
  anzahl: 5,
  nummer: 1,
};

function ladeStand(storageKey) {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const roh = window.localStorage.getItem(storageKey);
    return roh ? JSON.parse(roh) : null;
  } catch (e) {
    return null;
  }
}

function speichereStand(storageKey, stand) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(stand));
  } catch (e) {
    // localStorage evtl. nicht verfügbar — ignorieren
  }
}

export default function PageExplorer({storageKey}) {
  if (!storageKey) {
    throw new Error('PageExplorer: Prop "storageKey" ist Pflicht.');
  }

  const [frei, setFrei] = useState(false);
  const [hydriert, setHydriert] = useState(false);
  const [anzahlTipp, setAnzahlTipp] = useState('');
  const [nummerTipp, setNummerTipp] = useState('');
  const [rueckmeldung, setRueckmeldung] = useState(null);

  const [size, setSize] = useState(FRAGE.size);
  const [page, setPage] = useState(FRAGE.page);

  useEffect(() => {
    const stand = ladeStand(storageKey);
    if (stand && stand.frei) {
      setFrei(true);
    }
    setHydriert(true);
  }, [storageKey]);

  useEffect(() => {
    if (hydriert && frei) {
      speichereStand(storageKey, {frei: true});
    }
  }, [frei, hydriert, storageKey]);

  const totalPages = Math.ceil(GESAMT / size);
  const sichereSeite = Math.min(page, totalPages - 1);
  const von = sichereSeite * size;
  const bis = Math.min(von + size, GESAMT);
  const aufDerSeite = Math.max(bis - von, 0);

  const pruefen = (e) => {
    e.preventDefault();
    const a = parseInt(anzahlTipp, 10);
    const n = parseInt(nummerTipp, 10);
    setRueckmeldung({
      anzahl: a === FRAGE.anzahl,
      nummer: n === FRAGE.nummer,
    });
    setFrei(true);
  };

  return (
    <div className={styles.wrapper}>
      {!frei && (
        <form className={styles.vorhersage} onSubmit={pruefen}>
          <p className={styles.frageKopf}>
            <strong>Erst schätzen, dann schieben.</strong> Zwölf Einträge liegen in
            der Datenbank. Du rufst auf:
          </p>

          <code className={styles.url}>
            GET /api/v1/guestbook?page={FRAGE.page}&amp;size={FRAGE.size}
          </code>

          <div className={styles.frageZeile}>
            <label htmlFor={`${storageKey}-anzahl`}>Wie viele Einträge kommen zurück?</label>
            <input
              id={`${storageKey}-anzahl`}
              type="number"
              className={styles.tippFeld}
              value={anzahlTipp}
              onChange={(e) => setAnzahlTipp(e.target.value)}
            />
          </div>

          <div className={styles.frageZeile}>
            <label htmlFor={`${storageKey}-nummer`}>
              Welchen Wert hat das Feld <code>number</code>?
            </label>
            <input
              id={`${storageKey}-nummer`}
              type="number"
              className={styles.tippFeld}
              value={nummerTipp}
              onChange={(e) => setNummerTipp(e.target.value)}
            />
          </div>

          <div className={styles.knopfLeiste}>
            <button type="submit" className={styles.knopf}>
              Antwort abgeben und ausprobieren
            </button>
            <button
              type="button"
              className={`${styles.knopf} ${styles.knopfLeise}`}
              onClick={() => setFrei(true)}
            >
              Ohne Schätzung ansehen
            </button>
          </div>
        </form>
      )}

      {frei && (
        <>
          {rueckmeldung && (
            <p className={styles.aufloesung} role="status">
              Richtig wären <strong>{FRAGE.anzahl} Einträge</strong> und{' '}
              <code>number = {FRAGE.nummer}</code> gewesen — Seiten werden ab{' '}
              <strong>null</strong> gezählt.{' '}
              {rueckmeldung.anzahl && rueckmeldung.nummer
                ? 'Beides hattest du.'
                : 'Schieb die Regler und sieh nach, warum.'}
            </p>
          )}

          <div className={styles.regler}>
            <div className={styles.reglerZeile}>
              <label htmlFor={`${storageKey}-size`}>
                <code>size</code> — wie viele pro Seite
              </label>
              <input
                id={`${storageKey}-size`}
                type="range"
                min="1"
                max={GROESSTE_SEITE}
                value={size}
                onChange={(e) => {
                  const neu = Number(e.target.value);
                  setSize(neu);
                  setPage((p) => Math.min(p, Math.ceil(GESAMT / neu) - 1));
                }}
              />
              <output className={styles.wert}>{size}</output>
            </div>

            <div className={styles.reglerZeile}>
              <label htmlFor={`${storageKey}-page`}>
                <code>page</code> — welche Seite
              </label>
              <input
                id={`${storageKey}-page`}
                type="range"
                min="0"
                max={totalPages - 1}
                value={sichereSeite}
                onChange={(e) => setPage(Number(e.target.value))}
              />
              <output className={styles.wert}>{sichereSeite}</output>
            </div>
          </div>

          <code className={styles.url}>
            GET /api/v1/guestbook?page={sichereSeite}&amp;size={size}
          </code>

          <div className={styles.eintraege} aria-hidden="true">
            {Array.from({length: GESAMT}, (_, i) => (
              <div
                key={i}
                className={`${styles.eintrag} ${
                  i >= von && i < bis ? styles.imFenster : ''
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className={styles.legende}>
            Zwölf Einträge — hervorgehoben ist, was diese Anfrage zurückgibt
            ({aufDerSeite} {aufDerSeite === 1 ? 'Eintrag' : 'Einträge'}).
          </p>

          <div className={styles.felder}>
            <div className={styles.feld}>
              <span className={styles.feldName}>content</span>
              <span className={styles.feldWert}>{aufDerSeite} Einträge</span>
            </div>
            <div className={styles.feld}>
              <span className={styles.feldName}>totalElements</span>
              <span className={styles.feldWert}>{GESAMT}</span>
            </div>
            <div className={styles.feld}>
              <span className={styles.feldName}>totalPages</span>
              <span className={styles.feldWert}>{totalPages}</span>
            </div>
            <div className={styles.feld}>
              <span className={styles.feldName}>number</span>
              <span className={styles.feldWert}>{sichereSeite}</span>
            </div>
            <div className={styles.feld}>
              <span className={styles.feldName}>size</span>
              <span className={styles.feldWert}>{size}</span>
            </div>
            <div className={styles.feld}>
              <span className={styles.feldName}>first</span>
              <span className={styles.feldWert}>{String(sichereSeite === 0)}</span>
            </div>
            <div className={styles.feld}>
              <span className={styles.feldName}>last</span>
              <span className={styles.feldWert}>
                {String(sichereSeite === totalPages - 1)}
              </span>
            </div>
          </div>

          <p className={styles.suchauftrag}>
            <strong>Zwei Dinge zum Ausprobieren:</strong> Finde eine Einstellung, bei
            der die letzte Seite <em>weniger</em> Einträge enthält als die anderen.
            Und sieh nach, was <code>number</code> auf der ersten Seite anzeigt.
          </p>
        </>
      )}
    </div>
  );
}
