import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

/**
 * TestLayers — welche Schicht läuft bei welcher Testart wirklich?
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   <TestLayers storageKey="t3-ab02-schichten" />
 *
 * Die zentrale Fehlvorstellung dieses Tutorials lautet "@WebMvcTest
 * startet meine Anwendung". Sie ist raeumlich: vier Schichten
 * uebereinander, und je nach Testart ist jede entweder echt, durch ein
 * Doppel ersetzt oder gar nicht geladen. Genau das zeigt dieses Bild -
 * und die Vorhersage davor zwingt zur Festlegung, bevor man nachsieht.
 */

const ECHT = 'echt';
const DOPPEL = 'doppel';
const AUS = 'aus';

const SCHICHTEN = [
  {id: 'web', titel: 'Web-Schicht', zusatz: 'Controller, JSON, Statuscodes'},
  {id: 'fach', titel: 'Fachlichkeit', zusatz: 'Service, deine Regeln'},
  {id: 'daten', titel: 'Datenzugriff', zusatz: 'Repository, abgeleitete Abfragen'},
  {id: 'db', titel: 'Datenbank', zusatz: 'Tabellen, SQL'},
];

const ARTEN = [
  {
    id: 'unit',
    label: 'Unit-Test',
    unter: 'ohne Spring',
    zustand: {web: AUS, fach: ECHT, daten: DOPPEL, db: AUS},
    satz: 'Wird er rot, liegt es an deinen Regeln — an nichts sonst. Spring läuft hier gar nicht.',
  },
  {
    id: 'web',
    label: '@WebMvcTest',
    unter: 'Slice',
    zustand: {web: ECHT, fach: DOPPEL, daten: AUS, db: AUS},
    satz: 'Wird er rot, liegt es an der Übersetzung zwischen HTTP und Java. Ein Fehler in deinen Regeln bleibt hier unbemerkt — der Service ist ein Doppel.',
  },
  {
    id: 'jpa',
    label: '@DataJpaTest',
    unter: 'Slice',
    zustand: {web: AUS, fach: AUS, daten: ECHT, db: ECHT},
    satz: 'Wird er rot, liegt es an einer Abfrage oder am Mapping. Die Datenbank ist echt — aber eine eigene, nicht deine.',
  },
  {
    id: 'boot',
    label: '@SpringBootTest',
    unter: 'Integration',
    zustand: {web: ECHT, fach: ECHT, daten: ECHT, db: ECHT},
    satz: 'Wird er rot, weißt du nur: irgendwo. Dafür findet er als Einziger, was zwischen den Schichten schiefgeht.',
  },
];

const BESCHRIFTUNG = {
  [ECHT]: 'läuft echt',
  [DOPPEL]: 'durch ein Doppel ersetzt',
  [AUS]: 'nicht geladen',
};

/** Die Vorhersage, die vor dem Umschalten steht. */
const FRAGE_ART = 'web';
const FRAGE_SCHICHT = 'fach';

export default function TestLayers({storageKey}) {
  if (!storageKey) {
    throw new Error('TestLayers: Prop "storageKey" ist Pflicht.');
  }

  const [frei, setFrei] = useState(false);
  const [hydriert, setHydriert] = useState(false);
  const [tipp, setTipp] = useState(null);
  const [gewaehlt, setGewaehlt] = useState(FRAGE_ART);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setFrei(window.localStorage.getItem(storageKey) === 'true');
      } catch (e) {
        // ignorieren
      }
    }
    setHydriert(true);
  }, [storageKey]);

  useEffect(() => {
    if (hydriert && frei && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, 'true');
      } catch (e) {
        // ignorieren
      }
    }
  }, [frei, hydriert, storageKey]);

  const art = ARTEN.find((a) => a.id === gewaehlt);
  const richtig = ARTEN.find((a) => a.id === FRAGE_ART).zustand[FRAGE_SCHICHT];

  if (!frei) {
    return (
      <div className={`${styles.wrapper} ${styles.gesperrt}`}>
        <p className={styles.frageKopf}>
          <strong>Erst festlegen, dann nachsehen.</strong> Du startest einen Test mit{' '}
          <code>@WebMvcTest</code>. Was passiert dabei mit der{' '}
          <strong>Fachlichkeit</strong> — also mit deinem Service?
        </p>

        <div className={styles.auswahl}>
          {[ECHT, DOPPEL, AUS].map((z) => (
            <button
              key={z}
              type="button"
              className={styles.tippKnopf}
              onClick={() => {
                setTipp(z);
                setFrei(true);
              }}
            >
              {BESCHRIFTUNG[z]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {tipp && (
        <p className={styles.aufloesung} role="status">
          {tipp === richtig
            ? 'Stimmt: '
            : 'Nicht ganz — du hattest „' + BESCHRIFTUNG[tipp] + '". Richtig ist: '}
          Bei <code>@WebMvcTest</code> wird der Service{' '}
          <strong>{BESCHRIFTUNG[richtig]}</strong>.
        </p>
      )}

      <div className={styles.schalter} role="group" aria-label="Testart wählen">
        {ARTEN.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`${styles.artKnopf} ${
              a.id === gewaehlt ? styles.aktiv : ''
            }`}
            aria-pressed={a.id === gewaehlt}
            onClick={() => setGewaehlt(a.id)}
          >
            <span className={styles.artLabel}>{a.label}</span>
            <span className={styles.artUnter}>{a.unter}</span>
          </button>
        ))}
      </div>

      <ul className={styles.schichten}>
        {SCHICHTEN.map((s) => {
          const z = art.zustand[s.id];
          return (
            <li key={s.id} className={`${styles.schicht} ${styles[z]}`}>
              <span className={styles.schichtTitel}>{s.titel}</span>
              <span className={styles.schichtZusatz}>{s.zusatz}</span>
              <span className={styles.schichtStatus}>{BESCHRIFTUNG[z]}</span>
            </li>
          );
        })}
      </ul>

      <p className={styles.satz}>
        <strong>Was ein roter Test dann bedeutet:</strong> {art.satz}
      </p>
    </div>
  );
}
