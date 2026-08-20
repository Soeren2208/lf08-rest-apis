import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

/**
 * TestTable — Tabelle für Testfälle.
 *
 * Props:
 * - storageKey (Pflicht): eindeutiger Präfix für die localStorage-Persistenz
 * - tests: Array von Objekten
 *     {
 *       id: 'TF-01',
 *       beschreibung: '...',
 *       vorbedingung: '...',
 *       schritte: ['...', '...'],
 *       erwartet: <beliebiger React-Node>,
 *     }
 */

function loadState(storageKey) {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveState(storageKey, state) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (e) {
    // localStorage evtl. nicht verfügbar (z.B. privater Modus) — ignorieren
  }
}

export default function TestTable({tests = [], storageKey: rawStorageKey}) {
  if (!rawStorageKey) {
    throw new Error('TestTable: Prop "storageKey" ist Pflicht.');
  }

  // Präfix trennt den Fortschritt dieses (zweiten) Tutorials von dem des
  // ersten Tutorials (Personenverwaltung), falls beide Seiten jemals unter
  // derselben Origin ausgeliefert werden.
  const storageKey = `gaestebuch:${rawStorageKey}`;

  // Startwert erst nach dem Mount aus localStorage laden, damit SSR
  // (Docusaurus-Build) und Client-Render übereinstimmen.
  const [results, setResults] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setResults(loadState(storageKey));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (hydrated) {
      saveState(storageKey, results);
    }
  }, [results, hydrated, storageKey]);

  const setResult = (id, value) => {
    setResults((prev) => {
      const next = {...prev};
      if (next[id] === value) {
        delete next[id];
      } else {
        next[id] = value;
      }
      return next;
    });
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.testTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Beschreibung</th>
            <th>Vorbedingung</th>
            <th>Testschritte</th>
            <th>Erwartetes Ergebnis</th>
            <th>Ergebnis</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => {
            const current = results[test.id];
            return (
              <tr key={test.id}>
                <td>{test.id}</td>
                <td>{test.beschreibung}</td>
                <td>{test.vorbedingung}</td>
                <td>
                  {Array.isArray(test.schritte) ? (
                    <ol className={styles.schritteListe}>
                      {test.schritte.map((schritt, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={i}>{schritt}</li>
                      ))}
                    </ol>
                  ) : (
                    test.schritte
                  )}
                </td>
                <td>{test.erwartet}</td>
                <td>
                  <div className={styles.ergebnisButtons}>
                    <button
                      type="button"
                      className={`${styles.resultButton} ${styles.pass} ${
                        current === 'pass' ? styles.active : ''
                      }`}
                      aria-label={`Testfall ${test.id} als bestanden markieren`}
                      aria-pressed={current === 'pass'}
                      onClick={() => setResult(test.id, 'pass')}
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      className={`${styles.resultButton} ${styles.fail} ${
                        current === 'fail' ? styles.active : ''
                      }`}
                      aria-label={`Testfall ${test.id} als fehlgeschlagen markieren`}
                      aria-pressed={current === 'fail'}
                      onClick={() => setResult(test.id, 'fail')}
                    >
                      ✗
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
