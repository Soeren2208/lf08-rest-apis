import React, {useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

/**
 * Solution — Musterlösung, die erst nach Eingabe eines Passworts erscheint.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   import loesung from '@site/src/data/loesung-tutorial-01.json';
 *
 *   <Solution daten={loesung} />
 *
 * Die Lösung steht NICHT im Klartext in der Seite. In `daten` liegt nur
 * Geheimtext; das Passwort entschlüsselt ihn im Browser. Wer den
 * Seitenquelltext ansieht, findet eine Base64-Wurst und sonst nichts.
 *
 * Erzeugt wird `daten` von scripts/loesung-verschluesseln.mjs, das den
 * Quelltext direkt aus dem Referenzprojekt liest. Die Lösung kann deshalb
 * nicht vom lauffähigen Projekt abweichen.
 *
 * Verfahren: PBKDF2 (SHA-256) leitet den Schlüssel aus dem Passwort ab,
 * AES-GCM entschlüsselt. AES-GCM erkennt ein falsches Passwort von selbst —
 * die Entschlüsselung schlägt dann fehl, statt Unsinn zu liefern.
 */

function ausBase64(text) {
  const roh = window.atob(text);
  const bytes = new Uint8Array(roh.length);
  for (let i = 0; i < roh.length; i += 1) {
    bytes[i] = roh.charCodeAt(i);
  }
  return bytes;
}

async function entschluessele(daten, passwort) {
  const roh = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passwort),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  const schluessel = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: ausBase64(daten.salz),
      iterations: daten.runden,
      hash: 'SHA-256',
    },
    roh,
    {name: 'AES-GCM', length: 256},
    false,
    ['decrypt'],
  );
  const klartext = await window.crypto.subtle.decrypt(
    {name: 'AES-GCM', iv: ausBase64(daten.iv)},
    schluessel,
    ausBase64(daten.geheimtext),
  );
  return JSON.parse(new TextDecoder().decode(klartext));
}

export default function Solution({
  daten,
  titel = 'Musterlösung',
  hinweis = 'Das Passwort bekommst du von deiner Lehrkraft.',
}) {
  if (!daten) {
    throw new Error('Solution: Prop "daten" ist Pflicht.');
  }

  const [eingabe, setEingabe] = useState('');
  const [dateien, setDateien] = useState(null);
  const [fehler, setFehler] = useState('');
  const [laeuft, setLaeuft] = useState(false);

  const freischalten = async (e) => {
    e.preventDefault();
    if (!eingabe.trim() || laeuft) {
      return;
    }
    if (!window.crypto?.subtle) {
      setFehler(
        'Dieser Browser stellt die nötige Verschlüsselung nicht bereit. ' +
          'Über eine https-Adresse oder localhost funktioniert es.',
      );
      return;
    }

    setLaeuft(true);
    setFehler('');
    try {
      const inhalt = await entschluessele(daten, eingabe.trim());
      setDateien(inhalt.dateien);
    } catch (ex) {
      setFehler('Das Passwort stimmt nicht.');
    } finally {
      setLaeuft(false);
    }
  };

  if (dateien) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.kopfOffen}>
          <span className={styles.schloss} aria-hidden="true">
            ✓
          </span>
          <strong>{titel}</strong>
          <button
            type="button"
            className={styles.knopfLeise}
            onClick={() => {
              setDateien(null);
              setEingabe('');
            }}
          >
            Wieder zuklappen
          </button>
        </div>

        {dateien.map((datei) => (
          <CodeBlock key={datei.pfad} language={datei.sprache} title={datei.pfad}>
            {datei.inhalt}
          </CodeBlock>
        ))}
      </div>
    );
  }

  return (
    <form className={`${styles.wrapper} ${styles.gesperrt}`} onSubmit={freischalten}>
      <div className={styles.kopf}>
        <span className={styles.schloss} aria-hidden="true">
          🔒
        </span>
        <strong>{titel}</strong>
      </div>

      <p className={styles.hinweis}>{hinweis}</p>

      <div className={styles.zeile}>
        <label className={styles.label} htmlFor="solution-passwort">
          Passwort
        </label>
        <input
          id="solution-passwort"
          type="password"
          className={styles.eingabe}
          value={eingabe}
          autoComplete="off"
          onChange={(e) => {
            setEingabe(e.target.value);
            setFehler('');
          }}
        />
        <button type="submit" className={styles.knopf} disabled={laeuft}>
          {laeuft ? 'Einen Moment …' : 'Freischalten'}
        </button>
      </div>

      <p className={styles.fehler} role="status">
        {fehler}
      </p>
    </form>
  );
}
