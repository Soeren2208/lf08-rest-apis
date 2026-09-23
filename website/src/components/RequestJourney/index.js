import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.css';

/**
 * RequestJourney -- zeigt den Weg eines Requests durch Controller, Service,
 * Repository/Datenbank und (im Fehlerfall) den ApiExceptionHandler.
 *
 * Vier Szenarien x zwei Varianten (Erfolg/Fehler, bei der Liste nur Erfolg).
 * Jeder Schritt aktiviert eine Station und - falls vorhanden - die
 * Verbindung, auf der der Request gerade unterwegs ist. Die Verbindung
 * "fliesst" per CSS-Strichanimation (stroke-dashoffset), damit auch ohne
 * genaue Punktverfolgung eine echte Bewegungsrichtung zu sehen ist.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   <RequestJourney />
 */

const STATIONEN = {
  client: {x: 10, y: 30, w: 130, h: 70, label: 'Client'},
  controller: {x: 195, y: 30, w: 140, h: 70, label: 'Controller'},
  service: {x: 380, y: 30, w: 140, h: 70, label: 'Service'},
  repo: {x: 565, y: 30, w: 145, h: 70, label: 'Repository /', label2: 'Datenbank'},
  handler: {x: 260, y: 235, w: 200, h: 62, label: 'ApiExceptionHandler'},
};

/** Verbindungen als SVG-Pfade, jeweils in "Vorwaerts"-Richtung (vom ersten zum zweiten Namen). */
const VERBINDUNGEN = {
  'client-controller': 'M 140 65 L 195 65',
  'controller-service': 'M 335 65 L 380 65',
  'service-repo': 'M 520 65 L 565 65',
  'controller-handler': 'M 260 100 C 260 160 300 170 320 235',
  'service-handler': 'M 445 100 C 445 160 410 170 400 235',
  'handler-client': 'M 300 235 C 140 270 75 190 75 100',
};

function zahl(n) {
  return n === null || n === undefined ? '' : n.toLocaleString('de-DE');
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
          {station: 'client', text: 'Der Client ruft einen einzelnen Lieferanten ab.', payloadLabel: 'Request', payload: 'GET /api/v1/suppliers/1'},
          {station: 'controller', connector: 'client-controller', text: '`findSupplierById(id = 1)` nimmt die Pfadvariable entgegen und ruft `service.findById(1)`.', payloadLabel: 'Java', payload: 'Long id = 1L;'},
          {station: 'service', connector: 'controller-service', text: '`SupplierService.findById(1)` ist `@Transactional(readOnly = true)` und fragt das Repository.', payloadLabel: 'Aufruf', payload: 'supplierRepository.findById(1)'},
          {station: 'repo', connector: 'service-repo', text: 'Die Datenbank liefert die passende Zeile.', payloadLabel: 'SQL', payload: 'SELECT * FROM supplier\nWHERE id = 1;\n-- eine Zeile'},
          {station: 'service', connector: 'service-repo', direction: 'zurueck', text: 'Der Mapper baut aus der Entität das Antwort-DTO.', payloadLabel: 'Supplier -> SupplierDto', payload: 'new SupplierDto(1, "Nordmetall GmbH",\n    contactDto, articleCount)'},
          {station: 'controller', connector: 'controller-service', direction: 'zurueck', text: '`ResponseEntity.ok(dto)` verpackt das DTO mit Statuscode 200.', payloadLabel: 'Java', payload: 'ResponseEntity.ok(dto)'},
          {station: 'client', connector: 'client-controller', direction: 'zurueck', text: 'Der Client bekommt seine Antwort.', payloadLabel: 'Antwort', payload: '200 OK\n{"id":1,"name":"Nordmetall GmbH", ...}', status: 200},
        ],
      },
      fehler: {
        badge: 'Lieferant 999',
        steps: [
          {station: 'client', text: 'Der Client fragt eine Kennung ab, die es nicht gibt.', payloadLabel: 'Request', payload: 'GET /api/v1/suppliers/999'},
          {station: 'controller', connector: 'client-controller', text: '`findSupplierById(999)` ruft `service.findById(999)`.', payloadLabel: 'Java', payload: 'Long id = 999L;'},
          {station: 'service', connector: 'controller-service', text: 'Der Service fragt das Repository nach der Kennung 999.', payloadLabel: 'Aufruf', payload: 'supplierRepository.findById(999)'},
          {station: 'repo', connector: 'service-repo', text: 'Die Datenbank findet keine passende Zeile.', payloadLabel: 'SQL', payload: 'SELECT * FROM supplier\nWHERE id = 999;\n-- keine Zeile'},
          {station: 'service', connector: 'service-repo', direction: 'zurueck', text: '`orElseThrow(...)` wirft `SupplierNotFoundException`, statt weiterzumachen.', payloadLabel: 'Ausnahme', payload: 'throw new SupplierNotFoundException(999)'},
          {station: 'handler', connector: 'service-handler', text: '`handleNotFound(...)` übersetzt die Ausnahme in ein `ProblemDetail` mit Status 404.', payloadLabel: 'ProblemDetail', payload: '{"status":404,"title":"Nicht gefunden",\n "detail":"Es gibt keinen Lieferanten..."}'},
          {station: 'client', connector: 'handler-client', text: 'Repository und Controller-Rückweg werden dabei nie erreicht.', payloadLabel: 'Antwort', payload: '404 Not Found\n{"status":404, ...}', status: 404},
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
          {station: 'client', text: 'Der Client ruft die ganze Lieferantenliste ab.', payloadLabel: 'Request', payload: 'GET /api/v1/suppliers'},
          {station: 'controller', connector: 'client-controller', text: '`findAllSuppliers()` ruft `service.findAll()` — keine Parameter nötig.', payloadLabel: 'Java', payload: 'service.findAll()'},
          {station: 'service', connector: 'controller-service', text: '`findAll()` holt sich alle Lieferanten aus dem Repository.', payloadLabel: 'Aufruf', payload: 'supplierRepository.findAll()'},
          {station: 'repo', connector: 'service-repo', text: 'Die Datenbank liefert mehrere Zeilen.', payloadLabel: 'SQL', payload: 'SELECT * FROM supplier;\n-- mehrere Zeilen'},
          {station: 'service', connector: 'service-repo', direction: 'zurueck', text: 'Für jeden Lieferanten baut der Mapper ein DTO, inklusive gezählter Artikel.', payloadLabel: 'Supplier[] -> SupplierDto[]', payload: 'suppliers.stream()\n  .map(s -> mapper.toDto(s, count))\n  .toList()'},
          {station: 'controller', connector: 'controller-service', direction: 'zurueck', text: '`ResponseEntity.ok(liste)` verpackt die ganze Liste.', payloadLabel: 'Java', payload: 'ResponseEntity.ok(liste)'},
          {station: 'client', connector: 'client-controller', direction: 'zurueck', text: 'Der Client bekommt ein JSON-Array zurück.', payloadLabel: 'Antwort', payload: '200 OK\n[{"id":1, ...}, {"id":2, ...}]', status: 200},
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
          {station: 'client', text: 'Der Client legt einen neuen Lieferanten an.', payloadLabel: 'Request', payload: 'POST /api/v1/suppliers\n{"name":"Weser Werkzeug KG",\n "contact":{"street":"Am Deich 4", ...}}'},
          {station: 'controller', connector: 'client-controller', text: '`@Valid @RequestBody` bindet das JSON an `CreateSupplierDto` — Bean Validation findet keinen Verstoß.', payloadLabel: 'JSON -> CreateSupplierDto', payload: 'new CreateSupplierDto("Weser Werkzeug KG",\n    new CreateContactDto(...))'},
          {station: 'service', connector: 'controller-service', text: '`create(dto)` baut aus dem DTO eine neue Entität.', payloadLabel: 'CreateSupplierDto -> Supplier', payload: 'mapper.toEntity(dto)'},
          {station: 'repo', connector: 'service-repo', text: 'Die Datenbank speichert Lieferant und Anschrift (Kaskade) und vergibt eine Kennung.', payloadLabel: 'SQL', payload: 'INSERT INTO contact (...) VALUES (...);\nINSERT INTO supplier (...) VALUES (...);\n-- neue id: 3'},
          {station: 'service', connector: 'service-repo', direction: 'zurueck', text: 'Der Mapper baut aus der gespeicherten Entität das Antwort-DTO.', payloadLabel: 'Supplier -> SupplierDto', payload: 'mapper.toDto(saved, 0)'},
          {station: 'controller', connector: 'controller-service', direction: 'zurueck', text: '`ResponseEntity.created(location).body(dto)` — Statuscode 201 mit `Location`-Kopfzeile.', payloadLabel: 'Java', payload: 'ResponseEntity.created(location).body(dto)'},
          {station: 'client', connector: 'client-controller', direction: 'zurueck', text: 'Der Client bekommt die neue Kennung zurück.', payloadLabel: 'Antwort', payload: '201 Created\nLocation: /api/v1/suppliers/3\n{"id":3,"name":"Weser Werkzeug KG", ...}', status: 201},
        ],
      },
      fehler: {
        badge: 'leerer Name',
        steps: [
          {station: 'client', text: 'Der Client schickt einen Lieferanten ohne Namen.', payloadLabel: 'Request', payload: 'POST /api/v1/suppliers\n{"name":"","contact":{...}}'},
          {station: 'controller', connector: 'client-controller', text: '`@Valid` prüft `CreateSupplierDto`, **bevor** die Methode überhaupt läuft — der Name verletzt `@NotBlank`.', payloadLabel: 'Bean Validation', payload: '@NotBlank(message = "Der Name darf\\n  nicht leer sein.")\nString name; // ""'},
          {station: 'handler', connector: 'controller-handler', text: 'Service und Repository werden nie erreicht. `handleValidation(...)` baut die Fehlerantwort — mit Feldnamen.', payloadLabel: 'ProblemDetail', payload: '{"status":400,"title":"Ungültige Eingabe",\n "errors":{"name":"Der Name darf..."}}'},
          {station: 'client', connector: 'handler-client', text: 'Der Client erfährt genau, welches Feld falsch war.', payloadLabel: 'Antwort', payload: '400 Bad Request\n{"errors":{"name":"..."}}', status: 400},
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
          {station: 'client', text: 'Der Client löscht einen Lieferanten ohne Artikel.', payloadLabel: 'Request', payload: 'DELETE /api/v1/suppliers/2'},
          {station: 'controller', connector: 'client-controller', text: '`deleteSupplier(2)` ruft `service.deleteById(2)`.', payloadLabel: 'Java', payload: 'service.deleteById(2)'},
          {station: 'service', connector: 'controller-service', text: 'Der Service prüft: Lieferant existiert, `articleCount` ist 0.', payloadLabel: 'Prüfung', payload: 'articleRepository.countBySupplierId(2)\n// 0 -> darf gelöscht werden'},
          {station: 'repo', connector: 'service-repo', text: 'Die Datenbank löscht Lieferant und Anschrift (Kaskade).', payloadLabel: 'SQL', payload: 'DELETE FROM supplier WHERE id = 2;\n-- contact wird mitgelöscht'},
          {station: 'controller', connector: 'controller-service', direction: 'zurueck', text: '`ResponseEntity.noContent().build()` — Statuscode 204, kein Rumpf.', payloadLabel: 'Java', payload: 'ResponseEntity.noContent().build()'},
          {station: 'client', connector: 'client-controller', direction: 'zurueck', text: 'Der Client bekommt eine leere Erfolgsantwort.', payloadLabel: 'Antwort', payload: '204 No Content', status: 204},
        ],
      },
      fehler: {
        badge: 'mit Artikeln',
        steps: [
          {station: 'client', text: 'Der Client versucht, einen Lieferanten mit Artikeln zu löschen.', payloadLabel: 'Request', payload: 'DELETE /api/v1/suppliers/1'},
          {station: 'controller', connector: 'client-controller', text: '`deleteSupplier(1)` ruft `service.deleteById(1)`.', payloadLabel: 'Java', payload: 'service.deleteById(1)'},
          {station: 'service', connector: 'controller-service', text: 'Der Service liest nach: Lieferant 1 hat noch einen Artikel.', payloadLabel: 'Prüfung', payload: 'articleRepository.countBySupplierId(1)\n// 1 -> darf NICHT gelöscht werden'},
          {station: 'repo', connector: 'service-repo', text: 'Die Datenbank wird nur gelesen — kein `DELETE` wird ausgeführt.', payloadLabel: 'SQL', payload: 'SELECT count(*) FROM article\nWHERE supplier_id = 1;\n-- 1, kein DELETE'},
          {station: 'service', connector: 'service-repo', direction: 'zurueck', text: '`articleCount > 0` — der Service wirft `SupplierHasArticlesException`, statt zu löschen.', payloadLabel: 'Ausnahme', payload: 'throw new SupplierHasArticlesException(1, 1)'},
          {station: 'handler', connector: 'service-handler', text: '`handleConflict(...)` übersetzt das in Statuscode 409.', payloadLabel: 'ProblemDetail', payload: '{"status":409,"title":"Löschen nicht möglich",\n "detail":"Lieferant 1 hat noch 1 Artikel..."}'},
          {station: 'client', connector: 'handler-client', text: 'Der Lieferant bleibt erhalten — der Client erfährt, warum.', payloadLabel: 'Antwort', payload: '409 Conflict\n{"detail":"...hat noch 1 Artikel..."}', status: 409},
        ],
      },
    },
  },
};

const SZENARIO_IDS = ['getEins', 'getListe', 'post', 'delete'];

function statusFarbe(status) {
  if (status === null || status === undefined) return null;
  if (status < 300) return 'gut';
  return 'schlecht';
}

/* ---------------------------------------------------------------------- */

function Diagramm({steps, activeIndex}) {
  const step = steps[activeIndex];
  const activeStation = step.station;
  const activeConnector = step.connector;
  const direction = step.direction === 'zurueck';

  return (
    <svg viewBox="0 0 720 320" width="100%" role="img" aria-hidden="true" className={styles.diagramm}>
      {Object.entries(VERBINDUNGEN).map(([name, d]) => {
        const dashed = name.includes('handler');
        const active = name === activeConnector;
        return (
          <path
            key={name}
            d={d}
            className={[
              styles.linie,
              dashed ? styles.linieGestrichelt : '',
              active ? (direction ? styles.linieAktivZurueck : styles.linieAktiv) : '',
            ].join(' ')}
            fill="none"
            markerEnd={active && !direction ? 'url(#pfeil-aktiv)' : dashed ? undefined : 'url(#pfeil)'}
            markerStart={active && direction ? 'url(#pfeil-aktiv)' : undefined}
          />
        );
      })}

      <defs>
        <marker id="pfeil" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 z" className={styles.pfeilspitze} />
        </marker>
        <marker id="pfeil-aktiv" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
          <path d="M 0 0 L 9 4.5 L 0 9 z" className={styles.pfeilspitzeAktiv} />
        </marker>
      </defs>

      {Object.entries(STATIONEN).map(([name, s]) => {
        const active = name === activeStation;
        const relevant = steps.some((st) => st.station === name);
        return (
          <g key={name} className={[styles.station, active ? styles.stationAktiv : '', !relevant ? styles.stationBlass : ''].join(' ')}>
            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="10" className={styles.stationBox} />
            <text x={s.x + s.w / 2} y={s.y + s.h / 2 + (s.label2 ? -2 : 5)} textAnchor="middle" className={styles.stationLabel}>
              {s.label}
            </text>
            {s.label2 && (
              <text x={s.x + s.w / 2} y={s.y + s.h / 2 + 16} textAnchor="middle" className={styles.stationLabel}>
                {s.label2}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function RequestJourney() {
  const [szenarioId, setSzenarioId] = useState('getEins');
  const [variante, setVariante] = useState('erfolg');
  const [index, setIndex] = useState(0);
  const [spielt, setSpielt] = useState(false);
  const timer = useRef(null);

  const szenario = SZENARIEN[szenarioId];
  const hatFehler = !!szenario.varianten.fehler;
  const daten = szenario.varianten[variante] || szenario.varianten.erfolg;
  const steps = daten.steps;
  const step = steps[index];
  const letzterSchritt = index === steps.length - 1;

  useEffect(() => {
    if (!spielt) return undefined;
    if (letzterSchritt) {
      setSpielt(false);
      return undefined;
    }
    timer.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 2400);
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

      <Diagramm steps={steps} activeIndex={index} />

      <div className={styles.beschreibung}>
        <p className={styles.text}>{step.text}</p>
        <div className={styles.payload}>
          <span className={styles.payloadLabel}>{step.payloadLabel}</span>
          <pre className={styles.payloadCode}>{step.payload}</pre>
        </div>
        {farbe && (
          <span className={[styles.statusBadge, farbe === 'gut' ? styles.statusGut : styles.statusSchlecht].join(' ')}>
            {step.status}
          </span>
        )}
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
