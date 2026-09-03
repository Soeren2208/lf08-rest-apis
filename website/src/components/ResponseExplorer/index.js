import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

/**
 * ResponseExplorer — vier Kombinationen aus Ladezeitpunkt und Rueckgabetyp.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   <ResponseExplorer storageKey="t4-ab02-antwortform" />
 *
 * Warum ein Widget: Die Frage "was steht in der Antwort" ist raeumlich -
 * es geht um Verschachtelung, um Tiefe, um einen Kreis. Eine Tabelle mit
 * Messwerten zeigt die Zahlen, aber nicht die Form.
 *
 * Zwei der vier Faelle hat der Lernende im Arbeitsblatt selbst erzeugt;
 * die anderen zwei erschliesst er hier. Die Vorhersage davor zielt genau
 * auf die Fehlvorstellung, LAZY sei die Ursache des Problems.
 *
 * Alle Messwerte sind am Referenzprojekt gemessen, nicht geschaetzt:
 * ein Lieferant, ein Artikel, PostgreSQL 17.6, Spring Boot 4.1.1.
 */

const RUECKGABEN = [
  {id: 'entitaet', label: 'Entität', unter: 'List<Supplier>'},
  {id: 'dto', label: 'DTO', unter: 'List<SupplierDto>'},
];

const LADEN = [
  {id: 'lazy', label: 'LAZY', unter: 'Artikel erst bei Bedarf'},
  {id: 'eager', label: 'EAGER', unter: 'Artikel gleich mit'},
];

const FAELLE = {
  'entitaet|lazy': {
    status: 500,
    statusText: 'Internal Server Error',
    zeichen: null,
    tiefe: null,
    vorkommen: null,
    nameDrin: false,
    gueltig: false,
    form: 'abbruch',
    meldung:
      "Cannot lazily initialize collection of role 'de.szut.webshop.model.Supplier.articles' with key '1' (no session)",
    satz: 'Jackson fragt den Platzhalter nach den Artikeln, und die Verbindung zur Datenbank ist schon zu. Ob Artikel existieren, spielt keine Rolle.',
  },
  'entitaet|eager': {
    status: 200,
    statusText: 'OK — und trotzdem unbrauchbar',
    zeichen: 19438,
    tiefe: 500,
    vorkommen: 167,
    nameDrin: false,
    gueltig: false,
    form: 'kreis',
    meldung:
      'Could not write JSON: Document nesting depth (501) exceeds the maximum allowed (500)',
    satz: 'Der Statuscode war längst gesendet, als Jackson abbrach. Deshalb steht 200 über einer Antwort, die kein Client einlesen kann.',
  },
  'dto|lazy': {
    status: 200,
    statusText: 'OK',
    zeichen: 145,
    tiefe: 3,
    vorkommen: 0,
    nameDrin: true,
    gueltig: true,
    form: 'flach',
    meldung: null,
    satz: 'Das DTO hat kein Feld für Artikel — also fragt Jackson auch nicht danach. Der Platzhalter wird nie angefasst. Hibernate stellt drei Abfragen: Lieferant, Anschrift, und ein count für die Artikelzahl.',
  },
  'dto|eager': {
    status: 200,
    statusText: 'OK',
    zeichen: 145,
    tiefe: 3,
    vorkommen: 0,
    nameDrin: true,
    gueltig: true,
    form: 'flach',
    meldung: null,
    satz: 'Dieselbe Antwort — aber eine Abfrage mehr: Hibernate holt zusätzlich alle Artikelzeilen aus der Datenbank, obwohl keine einzige in der Antwort landet. Vier Abfragen statt drei, und die vierte war umsonst.',
  },
};

/** Die Vorhersage, die vor der Bedienung steht. */
const ANTWORTEN = [
  {
    id: 'a',
    text: '500 — der Fehler kam von LAZY, und LAZY bleibt LAZY',
    richtig: false,
    warum:
      'Nicht LAZY war die Ursache, sondern dass die Entität überhaupt ein Feld „articles" hat. Ein DTO ohne dieses Feld wird nie danach gefragt.',
  },
  {
    id: 'b',
    text: '200, aber die Artikelzahl fehlt — an die kommt man mit LAZY nicht heran',
    richtig: false,
    warum:
      'Die Artikelzahl lässt sich zählen, ohne die Artikel zu laden. Genau das tut der Service später mit einer eigenen Abfrage.',
  },
  {
    id: 'c',
    text: '200 mit einer flachen, kurzen Antwort',
    richtig: true,
    warum: null,
  },
  {
    id: 'd',
    text: '200, aber wieder mit tausenden Zeichen — der Kreis bleibt',
    richtig: false,
    warum:
      'Der Kreis entsteht erst dadurch, dass Article wieder einen ganzen Supplier enthält. Im DTO endet die Kette.',
  },
];

function zahl(wert) {
  return wert === null ? '—' : wert.toLocaleString('de-DE');
}

/** Die Form der Antwort, als verschachtelte Kästen. */
function Buehne({form}) {
  if (form === 'abbruch') {
    return (
      <div className={styles.buehne}>
        <div className={`${styles.kasten} ${styles.kaputt}`}>
          <span className={styles.kastenName}>Supplier</span>
          <div className={styles.feldzeile}>
            <code>id</code>, <code>name</code>, <code>contact</code>
          </div>
          <div className={`${styles.kasten} ${styles.platzhalter}`}>
            <span className={styles.kastenName}>articles</span>
            <div className={styles.feldzeile}>
              Platzhalter — fragt nach, aber niemand ist mehr da
            </div>
          </div>
        </div>
        <p className={styles.buehneFuss}>Die Umwandlung bricht hier ab.</p>
      </div>
    );
  }

  if (form === 'kreis') {
    const ebenen = ['Supplier', 'articles[0]', 'supplier', 'articles[0]', 'supplier'];
    let inhalt = <div className={styles.punkte}>… bis Tiefe 500</div>;
    for (let i = ebenen.length - 1; i >= 0; i -= 1) {
      inhalt = (
        <div className={`${styles.kasten} ${styles.kaputt}`}>
          <span className={styles.kastenName}>{ebenen[i]}</span>
          {inhalt}
        </div>
      );
    }
    return (
      <div className={styles.buehne}>
        {inhalt}
        <p className={styles.buehneFuss}>
          Zwei Felder zeigen aufeinander — JSON kennt keine Verweise, nur
          Verschachtelung.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.buehne}>
      <div className={`${styles.kasten} ${styles.gut}`}>
        <span className={styles.kastenName}>SupplierDto</span>
        <div className={styles.feldzeile}>
          <code>id: 1</code>
        </div>
        <div className={styles.feldzeile}>
          <code>name: &quot;Nordmetall GmbH&quot;</code>
        </div>
        <div className={`${styles.kasten} ${styles.gut}`}>
          <span className={styles.kastenName}>contact</span>
          <div className={styles.feldzeile}>
            <code>street</code>, <code>postcode</code>, <code>city</code>,{' '}
            <code>phone</code>
          </div>
        </div>
        <div className={styles.feldzeile}>
          <code>articleCount: 1</code>
        </div>
      </div>
      <p className={styles.buehneFuss}>
        Hier endet die Kette. Wer die Artikel braucht, ruft ihren eigenen
        Endpunkt auf.
      </p>
    </div>
  );
}

export default function ResponseExplorer({storageKey}) {
  if (!storageKey) {
    throw new Error('ResponseExplorer: Prop "storageKey" ist Pflicht.');
  }

  const [frei, setFrei] = useState(false);
  const [hydriert, setHydriert] = useState(false);
  const [tipp, setTipp] = useState(null);
  const [rueckgabe, setRueckgabe] = useState('dto');
  const [laden, setLaden] = useState('lazy');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setFrei(window.localStorage.getItem(storageKey) === 'true');
      } catch (e) {
        // localStorage evtl. nicht verfügbar
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

  const fall = FAELLE[`${rueckgabe}|${laden}`];

  if (!frei) {
    return (
      <div className={`${styles.wrapper} ${styles.gesperrt}`}>
        <p className={styles.frageKopf}>
          <strong>Erst festlegen, dann nachsehen.</strong> Du stellst den
          Endpunkt auf ein <strong>DTO</strong> um und lässt die Artikel auf{' '}
          <code>LAZY</code> stehen. Was kommt dann bei{' '}
          <code>GET /api/v1/suppliers</code> zurück?
        </p>

        <div className={styles.auswahl}>
          {ANTWORTEN.map((a) => (
            <button
              key={a.id}
              type="button"
              className={styles.tippKnopf}
              onClick={() => {
                setTipp(a);
                setFrei(true);
              }}
            >
              {a.text}
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
          {tipp.richtig
            ? 'Stimmt. '
            : `Nicht ganz. ${tipp.warum} `}
          Richtig ist: <strong>200 mit einer flachen, kurzen Antwort</strong> —
          145 Zeichen statt 19 438.
        </p>
      )}

      <div className={styles.regler}>
        <div className={styles.reglerGruppe} role="group" aria-label="Was gibt der Controller heraus?">
          <span className={styles.gruppenTitel}>Der Controller gibt heraus</span>
          <div className={styles.knopfreihe}>
            {RUECKGABEN.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`${styles.wahlKnopf} ${
                  r.id === rueckgabe ? styles.aktiv : ''
                }`}
                aria-pressed={r.id === rueckgabe}
                onClick={() => setRueckgabe(r.id)}
              >
                <span className={styles.wahlLabel}>{r.label}</span>
                <span className={styles.wahlUnter}>{r.unter}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.reglerGruppe} role="group" aria-label="Wann werden die Artikel geladen?">
          <span className={styles.gruppenTitel}>Artikel werden geladen</span>
          <div className={styles.knopfreihe}>
            {LADEN.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`${styles.wahlKnopf} ${
                  l.id === laden ? styles.aktiv : ''
                }`}
                aria-pressed={l.id === laden}
                onClick={() => setLaden(l.id)}
              >
                <span className={styles.wahlLabel}>{l.label}</span>
                <span className={styles.wahlUnter}>{l.unter}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`${styles.ergebnis} ${
          fall.gueltig ? styles.ergebnisGut : styles.ergebnisKaputt
        }`}
      >
        <div className={styles.statusZeile}>
          <span className={styles.statusCode}>{fall.status}</span>
          <span className={styles.statusText}>{fall.statusText}</span>
        </div>

        <dl className={styles.messwerte}>
          <div className={styles.messwert}>
            <dt>Zeichen</dt>
            <dd>{zahl(fall.zeichen)}</dd>
          </div>
          <div className={styles.messwert}>
            <dt>Tiefe</dt>
            <dd>{zahl(fall.tiefe)}</dd>
          </div>
          <div className={styles.messwert}>
            <dt>„articles" kommt vor</dt>
            <dd>{fall.vorkommen === null ? '—' : `${fall.vorkommen}×`}</dd>
          </div>
          <div className={styles.messwert}>
            <dt>Name des Lieferanten drin?</dt>
            <dd>{fall.nameDrin ? 'ja' : 'nein'}</dd>
          </div>
          <div className={styles.messwert}>
            <dt>gültiges JSON?</dt>
            <dd>{fall.gueltig ? 'ja' : 'nein'}</dd>
          </div>
        </dl>

        <Buehne form={fall.form} />

        {fall.meldung && (
          <p className={styles.meldung}>
            <span className={styles.meldungTitel}>In der Konsole:</span>
            <code>{fall.meldung}</code>
          </p>
        )}

        <p className={styles.satz}>{fall.satz}</p>
      </div>

      <p className={styles.suchauftrag}>
        <strong>Zwei Dinge zum Ausprobieren:</strong> Finde die einzige
        Einstellung, bei der die Antwort gültiges JSON ist <em>und</em> nichts
        umsonst geladen wird. Und sieh nach, was der Wechsel von{' '}
        <code>LAZY</code> auf <code>EAGER</code> an der Antwort ändert, sobald
        ein DTO im Spiel ist.
      </p>
    </div>
  );
}
