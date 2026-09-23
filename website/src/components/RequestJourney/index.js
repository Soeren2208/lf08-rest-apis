import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import styles from './styles.module.css';

/**
 * RequestJourney -- zeigt den Weg eines Requests durch Controller, Service,
 * Repository/Datenbank und (im Fehlerfall) den ApiExceptionHandler.
 *
 * Die Stationen sind ein CSS-Grid (kein SVG) - so kann mehrzeiliger
 * JSON/DTO-Text sauber umbrechen. Eine kleine "Paket-Karte" traegt bei
 * jedem Schritt den aktuellen Format-Namen und bewegt sich sichtbar
 * zwischen den echten, gemessenen Positionen der Stationen (per
 * getBoundingClientRect) - keine feste Choreografie, das passt sich von
 * selbst an jede Bildschirmbreite an. Die Verbindungslinien werden aus
 * denselben Messungen gezeichnet und liegen hinter den Kaesten.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   <RequestJourney />
 */

const STATION_REIHENFOLGE = ['client', 'controller', 'service', 'repo', 'handler'];

const STATION_INFO = {
  client: {label: 'Client', rolle: 'ruft auf'},
  controller: {label: 'Controller', rolle: '@RestController'},
  service: {label: 'Service', rolle: '@Service'},
  repo: {label: 'Repository / DB', rolle: '@Repository'},
  handler: {label: 'ApiExceptionHandler', rolle: '@RestControllerAdvice'},
};

/** Welche Stationen direkt verbunden sind - fuer die Linien im Hintergrund. */
const VERBINDUNGEN = [
  ['client', 'controller'],
  ['controller', 'service'],
  ['service', 'repo'],
  ['controller', 'handler'],
  ['service', 'handler'],
];

function Icon({name}) {
  const gemeinsam = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (name) {
    case 'client':
      return (
        <svg {...gemeinsam} aria-hidden="true">
          <rect x="2.5" y="3.5" width="19" height="13" rx="1.8" />
          <line x1="8" y1="20.5" x2="16" y2="20.5" />
          <line x1="12" y1="16.5" x2="12" y2="20.5" />
        </svg>
      );
    case 'controller':
      return (
        <svg {...gemeinsam} aria-hidden="true">
          <line x1="6" y1="4" x2="6" y2="20" />
          <path d="M6 6 L17 9 L6 12 Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'service':
      return (
        <svg {...gemeinsam} aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <line x1="12" y1="2.5" x2="12" y2="5.4" />
          <line x1="12" y1="18.6" x2="12" y2="21.5" />
          <line x1="2.5" y1="12" x2="5.4" y2="12" />
          <line x1="18.6" y1="12" x2="21.5" y2="12" />
          <line x1="5.3" y1="5.3" x2="7.3" y2="7.3" />
          <line x1="16.7" y1="16.7" x2="18.7" y2="18.7" />
          <line x1="18.7" y1="5.3" x2="16.7" y2="7.3" />
          <line x1="7.3" y1="16.7" x2="5.3" y2="18.7" />
        </svg>
      );
    case 'repo':
      return (
        <svg {...gemeinsam} aria-hidden="true">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6 V17 A8 3 0 0 0 20 17 V6" />
          <path d="M4 11.5 A8 3 0 0 0 20 11.5" />
        </svg>
      );
    case 'handler':
      return (
        <svg {...gemeinsam} aria-hidden="true">
          <path d="M12 3.2 L21.5 20 H2.5 Z" />
          <line x1="12" y1="9.5" x2="12" y2="14.3" />
          <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------------------------------------------------------------------- */
/*  Die sieben Szenario/Varianten-Datensaetze                             */
/* ---------------------------------------------------------------------- */

const SZENARIEN = {
  getEins: {
    label: 'GET',
    unter: 'ein Lieferant',
    varianten: {
      erfolg: {
        badge: 'Lieferant 1',
        steps: [
          {station: 'client', format: 'Request', payload: 'GET /api/v1/suppliers/1', text: 'Der Client ruft einen einzelnen Lieferanten ab.'},
          {station: 'controller', format: 'Java', payload: 'Long id = 1L;', text: '`findSupplierById(id = 1)` ruft `service.findById(1)`.'},
          {station: 'service', format: 'Aufruf', payload: 'supplierRepository.findById(1)', text: '`@Transactional(readOnly = true)` — der Service fragt das Repository.'},
          {station: 'repo', format: 'SQL', payload: 'SELECT * FROM supplier\nWHERE id = 1;\n-- eine Zeile', text: 'Die Datenbank liefert die passende Zeile.'},
          {station: 'service', format: 'Supplier → SupplierDto', payload: 'new SupplierDto(1, "Nordmetall GmbH",\n  contactDto, articleCount)', text: 'Der Mapper baut aus der Entität das Antwort-DTO.'},
          {station: 'controller', format: 'Java', payload: 'ResponseEntity.ok(dto)', text: 'Statuscode 200, das DTO im Rumpf.'},
          {station: 'client', format: 'Antwort', payload: '200 OK\n{"id":1,"name":"Nordmetall GmbH", ...}', text: 'Der Client bekommt seine Antwort.', status: 200},
        ],
      },
      fehler: {
        badge: 'Lieferant 999',
        steps: [
          {station: 'client', format: 'Request', payload: 'GET /api/v1/suppliers/999', text: 'Der Client fragt eine Kennung ab, die es nicht gibt.'},
          {station: 'controller', format: 'Java', payload: 'Long id = 999L;', text: '`findSupplierById(999)` ruft `service.findById(999)`.'},
          {station: 'service', format: 'Aufruf', payload: 'supplierRepository.findById(999)', text: 'Der Service fragt das Repository nach der Kennung 999.'},
          {station: 'repo', format: 'SQL', payload: 'SELECT * FROM supplier\nWHERE id = 999;\n-- keine Zeile', text: 'Die Datenbank findet keine passende Zeile.'},
          {station: 'service', format: 'Ausnahme', payload: 'throw new SupplierNotFoundException(999)', text: '`orElseThrow(...)` wirft, statt weiterzumachen.'},
          {station: 'handler', format: 'ProblemDetail', payload: '{"status":404,"title":"Nicht gefunden",\n "detail":"Es gibt keinen Lieferanten..."}', text: '`handleNotFound(...)` übersetzt die Ausnahme in Statuscode 404.'},
          {station: 'client', format: 'Antwort', payload: '404 Not Found\n{"status":404, ...}', text: 'Repository-Rückweg und Controller werden dabei nie erreicht.', status: 404},
        ],
      },
    },
  },

  getListe: {
    label: 'GET',
    unter: 'alle Lieferanten',
    varianten: {
      erfolg: {
        badge: 'Liste',
        steps: [
          {station: 'client', format: 'Request', payload: 'GET /api/v1/suppliers', text: 'Der Client ruft die ganze Lieferantenliste ab.'},
          {station: 'controller', format: 'Java', payload: 'service.findAll()', text: '`findAllSuppliers()` — keine Parameter nötig.'},
          {station: 'service', format: 'Aufruf', payload: 'supplierRepository.findAll()', text: '`findAll()` holt sich alle Lieferanten.'},
          {station: 'repo', format: 'SQL', payload: 'SELECT * FROM supplier;\n-- mehrere Zeilen', text: 'Die Datenbank liefert mehrere Zeilen.'},
          {station: 'service', format: 'Supplier[] → SupplierDto[]', payload: 'suppliers.stream()\n  .map(s -> mapper.toDto(s, count))\n  .toList()', text: 'Für jeden Lieferanten baut der Mapper ein DTO.'},
          {station: 'controller', format: 'Java', payload: 'ResponseEntity.ok(liste)', text: 'Die ganze Liste wird verpackt.'},
          {station: 'client', format: 'Antwort', payload: '200 OK\n[{"id":1, ...}, {"id":2, ...}]', text: 'Der Client bekommt ein JSON-Array.', status: 200},
        ],
      },
      fehler: null,
    },
  },

  post: {
    label: 'POST',
    unter: 'Lieferant anlegen',
    varianten: {
      erfolg: {
        badge: 'gültige Daten',
        steps: [
          {station: 'client', format: 'Request', payload: 'POST /api/v1/suppliers\n{"name":"Weser Werkzeug KG", ...}', text: 'Der Client legt einen neuen Lieferanten an.'},
          {station: 'controller', format: 'JSON → CreateSupplierDto', payload: 'new CreateSupplierDto("Weser Werkzeug KG",\n  new CreateContactDto(...))', text: '`@Valid` prüft das DTO — kein Verstoß.'},
          {station: 'service', format: 'CreateSupplierDto → Supplier', payload: 'mapper.toEntity(dto)', text: '`create(dto)` baut eine neue Entität.'},
          {station: 'repo', format: 'SQL', payload: 'INSERT INTO contact (...) VALUES (...);\nINSERT INTO supplier (...) VALUES (...);\n-- neue id: 3', text: 'Lieferant und Anschrift werden gespeichert (Kaskade).'},
          {station: 'service', format: 'Supplier → SupplierDto', payload: 'mapper.toDto(saved, 0)', text: 'Der Mapper baut das Antwort-DTO.'},
          {station: 'controller', format: 'Java', payload: 'ResponseEntity.created(location).body(dto)', text: 'Statuscode 201 mit `Location`-Kopfzeile.'},
          {station: 'client', format: 'Antwort', payload: '201 Created\nLocation: /api/v1/suppliers/3\n{"id":3, ...}', text: 'Der Client bekommt die neue Kennung.', status: 201},
        ],
      },
      fehler: {
        badge: 'leerer Name',
        steps: [
          {station: 'client', format: 'Request', payload: 'POST /api/v1/suppliers\n{"name":"","contact":{...}}', text: 'Der Client schickt einen Lieferanten ohne Namen.'},
          {station: 'controller', format: 'Bean Validation', payload: '@NotBlank String name; // ""\n// verletzt, bevor die Methode laeuft', text: '`@Valid` prüft, **bevor** die Methode überhaupt läuft.'},
          {station: 'handler', format: 'ProblemDetail', payload: '{"status":400,"title":"Ungültige Eingabe",\n "errors":{"name":"Der Name darf..."}}', text: 'Service und Repository werden nie erreicht.'},
          {station: 'client', format: 'Antwort', payload: '400 Bad Request\n{"errors":{"name":"..."}}', text: 'Der Client erfährt, welches Feld falsch war.', status: 400},
        ],
      },
    },
  },

  delete: {
    label: 'DELETE',
    unter: 'Lieferant löschen',
    varianten: {
      erfolg: {
        badge: 'ohne Artikel',
        steps: [
          {station: 'client', format: 'Request', payload: 'DELETE /api/v1/suppliers/2', text: 'Der Client löscht einen Lieferanten ohne Artikel.'},
          {station: 'controller', format: 'Java', payload: 'service.deleteById(2)', text: '`deleteSupplier(2)` ruft den Service.'},
          {station: 'service', format: 'Prüfung', payload: 'articleRepository.countBySupplierId(2)\n// 0 -> darf gelöscht werden', text: 'Der Service prüft: `articleCount` ist 0.'},
          {station: 'repo', format: 'SQL', payload: 'DELETE FROM supplier WHERE id = 2;\n-- contact wird mitgelöscht', text: 'Lieferant und Anschrift werden gelöscht (Kaskade).'},
          {station: 'controller', format: 'Java', payload: 'ResponseEntity.noContent().build()', text: 'Statuscode 204, kein Rumpf.'},
          {station: 'client', format: 'Antwort', payload: '204 No Content', text: 'Der Client bekommt eine leere Erfolgsantwort.', status: 204},
        ],
      },
      fehler: {
        badge: 'mit Artikeln',
        steps: [
          {station: 'client', format: 'Request', payload: 'DELETE /api/v1/suppliers/1', text: 'Der Client versucht, einen Lieferanten mit Artikeln zu löschen.'},
          {station: 'controller', format: 'Java', payload: 'service.deleteById(1)', text: '`deleteSupplier(1)` ruft den Service.'},
          {station: 'service', format: 'Prüfung', payload: 'articleRepository.countBySupplierId(1)\n// 1 -> darf NICHT gelöscht werden', text: 'Der Service liest nach: Lieferant 1 hat noch einen Artikel.'},
          {station: 'repo', format: 'SQL', payload: 'SELECT count(*) FROM article\nWHERE supplier_id = 1;\n-- 1, kein DELETE', text: 'Die Datenbank wird nur gelesen.'},
          {station: 'service', format: 'Ausnahme', payload: 'throw new SupplierHasArticlesException(1, 1)', text: '`articleCount > 0` — der Service wirft, statt zu löschen.'},
          {station: 'handler', format: 'ProblemDetail', payload: '{"status":409,"title":"Löschen nicht möglich",\n "detail":"...hat noch 1 Artikel..."}', text: '`handleConflict(...)` übersetzt das in Statuscode 409.'},
          {station: 'client', format: 'Antwort', payload: '409 Conflict\n{"detail":"...hat noch 1 Artikel..."}', text: 'Der Lieferant bleibt erhalten.', status: 409},
        ],
      },
    },
  },
};

const SZENARIO_IDS = ['getEins', 'getListe', 'post', 'delete'];

function statusFarbe(status) {
  if (status === null || status === undefined) return null;
  return status < 300 ? 'gut' : 'schlecht';
}

/* ---------------------------------------------------------------------- */

export default function RequestJourney() {
  const [szenarioId, setSzenarioId] = useState('getEins');
  const [variante, setVariante] = useState('erfolg');
  const [index, setIndex] = useState(0);
  const [spielt, setSpielt] = useState(false);
  const timer = useRef(null);

  const containerRef = useRef(null);
  const stationRefs = useRef({});
  const [positionen, setPositionen] = useState(null);

  const szenario = SZENARIEN[szenarioId];
  const hatFehler = !!szenario.varianten.fehler;
  const daten = szenario.varianten[variante] || szenario.varianten.erfolg;
  const steps = daten.steps;
  const step = steps[index];
  const letzterSchritt = index === steps.length - 1;

  function messen() {
    const container = containerRef.current;
    if (!container) return;
    const contRect = container.getBoundingClientRect();
    const neu = {};
    STATION_REIHENFOLGE.forEach((name) => {
      const el = stationRefs.current[name];
      if (!el) return;
      const r = el.getBoundingClientRect();
      neu[name] = {
        x: r.left - contRect.left + r.width / 2,
        y: r.top - contRect.top + r.height / 2,
      };
    });
    setPositionen(neu);
  }

  useLayoutEffect(() => {
    messen();
    const onResize = () => messen();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [szenarioId, variante]);

  useEffect(() => {
    if (!spielt) return undefined;
    if (letzterSchritt) {
      setSpielt(false);
      return undefined;
    }
    timer.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 4800);
    return () => clearTimeout(timer.current);
  }, [spielt, index, steps.length, letzterSchritt]);

  function wechsleSzenario(id) {
    setSzenarioId(id);
    setVariante('erfolg');
    setIndex(0);
    setSpielt(false);
  }

  function wechsleVariante(v) {
    setVariante(v);
    setIndex(0);
    setSpielt(false);
  }

  function gehe(i) {
    setIndex(Math.max(0, Math.min(i, steps.length - 1)));
    setSpielt(false);
  }

  const farbe = statusFarbe(step.status);
  const relevanteStationen = new Set(steps.map((s) => s.station));
  const paketPos = positionen && positionen[step.station];

  return (
    <div className={styles.wrapper}>
      <div className={styles.szenarien} role="group" aria-label="Szenario wählen">
        {SZENARIO_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={[styles.szenarioKnopf, id === szenarioId ? styles.aktiv : ''].join(' ')}
            aria-pressed={id === szenarioId}
            onClick={() => wechsleSzenario(id)}
          >
            <span className={styles.szenarioLabel}>{SZENARIEN[id].label}</span>
            <span className={styles.szenarioUnter}>{SZENARIEN[id].unter}</span>
          </button>
        ))}
      </div>

      {hatFehler && (
        <div className={styles.variantenReihe} role="group" aria-label="Erfolg oder Fehler">
          <button
            type="button"
            className={[styles.variantenKnopf, variante === 'erfolg' ? styles.aktiv : ''].join(' ')}
            aria-pressed={variante === 'erfolg'}
            onClick={() => wechsleVariante('erfolg')}
          >
            Erfolg — {szenario.varianten.erfolg.badge}
          </button>
          <button
            type="button"
            className={[styles.variantenKnopf, styles.variantenKnopfFehler, variante === 'fehler' ? styles.aktiv : ''].join(' ')}
            aria-pressed={variante === 'fehler'}
            onClick={() => wechsleVariante('fehler')}
          >
            Fehler — {szenario.varianten.fehler.badge}
          </button>
        </div>
      )}

      <div className={styles.buehne} ref={containerRef}>
        <svg className={styles.linienSchicht} aria-hidden="true">
          {positionen &&
            VERBINDUNGEN.map(([a, b]) => {
              const pa = positionen[a];
              const pb = positionen[b];
              if (!pa || !pb) return null;
              return (
                <line
                  key={`${a}-${b}`}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  className={a === 'client' || b === 'client' || (a !== 'handler' && b !== 'handler') ? styles.linie : styles.linieGestrichelt}
                />
              );
            })}
        </svg>

        <div className={styles.grid}>
          {STATION_REIHENFOLGE.map((name) => {
            const info = STATION_INFO[name];
            const aktiv = name === step.station;
            const relevant = relevanteStationen.has(name);
            return (
              <div
                key={name}
                ref={(el) => {
                  stationRefs.current[name] = el;
                }}
                className={[
                  styles.station,
                  styles[`station_${name}`],
                  aktiv ? styles.stationAktiv : '',
                  !relevant ? styles.stationBlass : '',
                ].join(' ')}
              >
                <span className={styles.stationIcon}>
                  <Icon name={name} />
                </span>
                <span className={styles.stationLabel}>{info.label}</span>
                <span className={styles.stationRolle}>{info.rolle}</span>
              </div>
            );
          })}
        </div>

        {paketPos && (
          <div
            className={styles.paket}
            style={{
              transform: `translate(${paketPos.x}px, ${paketPos.y - 40}px) translate(-50%, -50%)`,
            }}
          >
            <span className={styles.paketInner}>{step.format}</span>
            <span className={styles.paketSpitze} />
          </div>
        )}
      </div>

      <div className={styles.beschreibung}>
        <div className={styles.beschreibungKopf}>
          <span className={styles.text}>{step.text}</span>
          {farbe && (
            <span className={[styles.statusBadge, farbe === 'gut' ? styles.statusGut : styles.statusSchlecht].join(' ')}>
              {step.status}
            </span>
          )}
        </div>
        <pre className={styles.payloadCode}>{step.payload}</pre>
      </div>

      <div className={styles.steuerung}>
        <button type="button" className={styles.iconKnopf} onClick={() => gehe(index - 1)} disabled={index === 0} aria-label="Ein Schritt zurück">
          ◀
        </button>
        <button
          type="button"
          className={styles.playKnopf}
          onClick={() => {
            if (letzterSchritt) {
              setIndex(0);
              setSpielt(true);
            } else {
              setSpielt((s) => !s);
            }
          }}
        >
          {spielt ? '⏸ Pause' : letzterSchritt ? '↻ Neu' : '▶ Play'}
        </button>
        <button type="button" className={styles.iconKnopf} onClick={() => gehe(index + 1)} disabled={letzterSchritt} aria-label="Ein Schritt vor">
          ▶
        </button>
      </div>

      <div className={styles.punkte} role="group" aria-label="Schritt wählen">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            className={[styles.punkt, i === index ? styles.punktAktiv : ''].join(' ')}
            aria-label={`Schritt ${i + 1} von ${steps.length}`}
            aria-current={i === index}
            onClick={() => gehe(i)}
          />
        ))}
      </div>
    </div>
  );
}
