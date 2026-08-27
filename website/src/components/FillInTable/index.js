import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

/**
 * FillInTable — Tabelle zum Ausfüllen mit Selbstkontrolle.
 *
 * Gedacht für Zuordnungsaufgaben, bei denen die Schüler erst selbst
 * antworten und die Auflösung anschließend aufdecken.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   <FillInTable
 *     storageKey="t2-ab02-status"
 *     spalteLinks="Situation"
 *     spalteRechts="Dein Statuscode"
 *     platzhalter="z. B. 200"
 *     zeilen={[
 *       {id: 'post', links: 'Eintrag angelegt', loesung: '201', klartext: '201 Created'},
 *     ]}
 *   />
 *
 * Props:
 * - storageKey (Pflicht): Präfix für die localStorage-Persistenz
 * - zeilen (Pflicht): Array aus
 *     {
 *       id:       eindeutig innerhalb der Tabelle,
 *       links:    Text der linken Spalte (React-Node erlaubt),
 *       loesung:  die erwartete Antwort, gegen die verglichen wird,
 *       klartext: optional — was in der Auflösung angezeigt wird
 *                 (Voreinstellung: loesung),
 *     }
 * - spalteLinks / spalteRechts: Spaltenüberschriften
 * - platzhalter: Platzhaltertext der Eingabefelder
 *
 * Vergleich — bewusst nachsichtig, weil die Sache zählt und nicht die
 * Schreibweise:
 *
 * - Enthält die Lösung eine dreistellige Zahl (Statuscodes), wird nur die
 *   Zahl verglichen: "404", "404 Not Found" und "Status 404" gelten alle.
 * - Sonst genügt es, wenn die Lösung in der Eingabe VORKOMMT: Auf die
 *   Lösung "unit" passen "Unit", "Unit-Test" und "ein Unit-Test".
 *   Gross-/Kleinschreibung und Mehrfach-Leerzeichen sind egal.
 */

/** Vereinheitlicht Schreibweise und Leerzeichen. */
function normalisiere(wert) {
  return String(wert || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/** Zieht die erste dreistellige Zahl heraus, sonst null. */
function zahlAus(wert) {
  const treffer = String(wert || '').match(/\d{3}/);
  return treffer ? treffer[0] : null;
}

function stimmt(eingabe, loesung) {
  const text = normalisiere(eingabe);
  if (!text) {
    return false;
  }
  const erwarteteZahl = zahlAus(loesung);
  if (erwarteteZahl) {
    return zahlAus(eingabe) === erwarteteZahl;
  }
  return text.includes(normalisiere(loesung));
}

function ladeStand(storageKey) {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const roh = window.localStorage.getItem(storageKey);
    return roh ? JSON.parse(roh) : {};
  } catch (e) {
    return {};
  }
}

function speichereStand(storageKey, stand) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(stand));
  } catch (e) {
    // localStorage evtl. nicht verfügbar (z.B. privater Modus) — ignorieren
  }
}

export default function FillInTable({
  zeilen = [],
  storageKey,
  spalteLinks = 'Situation',
  spalteRechts = 'Deine Antwort',
  platzhalter = '',
}) {
  if (!storageKey) {
    throw new Error('FillInTable: Prop "storageKey" ist Pflicht.');
  }

  // Startwert erst nach dem Mount laden, damit SSR (Docusaurus-Build) und
  // Client-Render übereinstimmen.
  const [eingaben, setEingaben] = useState({});
  const [hydriert, setHydriert] = useState(false);
  const [aufgedeckt, setAufgedeckt] = useState(false);

  useEffect(() => {
    setEingaben(ladeStand(storageKey));
    setHydriert(true);
  }, [storageKey]);

  useEffect(() => {
    if (hydriert) {
      speichereStand(storageKey, eingaben);
    }
  }, [eingaben, hydriert, storageKey]);

  const setzeEingabe = (id, wert) => {
    setEingaben((vorher) => ({...vorher, [id]: wert}));
  };

  const leeren = () => {
    setEingaben({});
    setAufgedeckt(false);
  };

  const ausgefuellt = zeilen.filter((z) => (eingaben[z.id] || '').trim()).length;
  const richtig = zeilen.filter((z) => stimmt(eingaben[z.id], z.loesung)).length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{spalteLinks}</th>
              <th className={styles.antwortSpalte}>{spalteRechts}</th>
              {aufgedeckt && <th className={styles.antwortSpalte}>Auflösung</th>}
            </tr>
          </thead>
          <tbody>
            {zeilen.map((zeile) => {
              const eingabe = eingaben[zeile.id] || '';
              const istRichtig = stimmt(eingabe, zeile.loesung);
              const leer = !eingabe.trim();

              return (
                <tr key={zeile.id}>
                  <td>{zeile.links}</td>
                  <td className={styles.antwortSpalte}>
                    <div className={styles.eingabeZelle}>
                      <input
                        type="text"
                        className={`${styles.eingabe} ${
                          aufgedeckt
                            ? istRichtig
                              ? styles.richtig
                              : styles.falsch
                            : ''
                        }`}
                        value={eingabe}
                        placeholder={platzhalter}
                        aria-label={
                          typeof zeile.links === 'string'
                            ? `${spalteRechts}: ${zeile.links}`
                            : spalteRechts
                        }
                        onChange={(e) => setzeEingabe(zeile.id, e.target.value)}
                      />
                      {aufgedeckt && !leer && (
                        <span
                          className={istRichtig ? styles.hakenOk : styles.hakenFalsch}
                          aria-hidden="true"
                        >
                          {istRichtig ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </td>
                  {aufgedeckt && (
                    <td className={styles.antwortSpalte}>
                      <code>{zeile.klartext || zeile.loesung}</code>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.leiste}>
        <button
          type="button"
          className={styles.knopf}
          onClick={() => setAufgedeckt((v) => !v)}
        >
          {aufgedeckt ? 'Auflösung ausblenden' : 'Auflösung anzeigen'}
        </button>
        <button
          type="button"
          className={`${styles.knopf} ${styles.knopfLeise}`}
          onClick={leeren}
        >
          Zurücksetzen
        </button>
        <span className={styles.stand} role="status">
          {aufgedeckt
            ? `${richtig} von ${zeilen.length} richtig`
            : `${ausgefuellt} von ${zeilen.length} ausgefüllt`}
        </span>
      </div>
    </div>
  );
}
