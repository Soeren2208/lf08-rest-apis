// ===========================================================================
//  WELCHE TUTORIALS VERÖFFENTLICHT WERDEN
// ===========================================================================
//
//  In dieser Datei steht NICHT, was freigeschaltet ist — hier stehen nur die
//  Tutorials, die es überhaupt gibt.
//
//  Freigeschaltet wird über die Variable TUTORIALS:
//
//    Auf GitHub:  Settings → Secrets and variables → Actions → Variables
//                 Name: TUTORIALS
//                 Wert: tutorial-01,tutorial-02
//                 Danach unter "Actions" den Workflow von Hand starten
//                 ("Run workflow") — fertig, kein Commit nötig.
//
//    Lokal:       gar nicht. Beim Entwickeln auf dem eigenen Rechner sind
//                 IMMER alle Tutorials sichtbar, damit man sehen kann,
//                 woran man arbeitet.
//
//  Warum nicht mehr über ein Feld in dieser Datei?
//  Weil die Freigabe damit im Quelltext stünde. Zwei Lehrkräfte, die
//  dasselbe Material zu unterschiedlichen Zeitpunkten freischalten, kämen
//  sich bei jeder Änderung ins Gehege — und wer zum Ansehen kurz etwas
//  einschaltet, vergisst leicht, es vor dem Commit zurückzustellen.
//
//  Ein nicht freigeschaltetes Tutorial wird gar nicht erst gebaut. Seine
//  Adresse liefert einen 404 — auch für jemanden, der sie errät.
//
//  Die Infoblätter sind nie geschaltet: Sie sind Nachschlagematerial und
//  immer erreichbar.
// ===========================================================================

const tutorials = [
  {
    id: 'tutorial-01',
    nummer: '01',
    titel: 'Personenverwaltung',
    stichworte: 'Spring Initializr · REST-Controller · Record · Actuator',
    beschreibung:
      'Der Einstieg: ein Spring-Boot-Projekt aufsetzen, Daten in einer ' +
      'Datenbank ablegen und über HTTP bereitstellen.',
  },
  {
    id: 'tutorial-02',
    nummer: '02',
    titel: 'Gästebuch',
    verweistAuf: ['tutorial-01'],
    stichworte: 'Lombok · ResponseEntity · Paginierung · OpenAPI',
    beschreibung:
      'Die Schnittstelle wird gut: vollständige Antworten, dauerhafte ' +
      'Speicherung, Suchen und Blättern, dokumentiert mit OpenAPI.',
  },
  {
    id: 'tutorial-03',
    nummer: '03',
    titel: 'Das Gästebuch testen',
    verweistAuf: ['tutorial-02'],
    stichworte: 'Service-Schicht · JUnit · Mocks · Slice-Tests · Testpyramide',
    beschreibung:
      'Woher weißt du, dass dein Code tut, was du glaubst? Unit-Tests, ' +
      'Slice-Tests für Web und Datenbank — und ein Entwurfsfehler, den ' +
      'erst ein Test ans Licht bringt.',
  },
  {
    id: 'tutorial-04',
    nummer: '04',
    titel: 'Webshop',
    verweistAuf: ['tutorial-02'],
    stichworte: 'Docker · PostgreSQL · Beziehungen · DTO · Service-Schicht',
    beschreibung:
      'Drei Tabellen, die zusammenhängen: Die Datenbank zieht in einen ' +
      'Container, eine Beziehung legt einen laufenden Endpunkt lahm, und ' +
      'die Antwort wird zum ersten Mal selbst entworfen.',
  },
];

// GitHub Actions setzt CI=true. Daran erkennen wir eine Veröffentlichung.
const veroeffentlichung = process.env.CI === 'true';
const angefordert = (process.env.TUTORIALS || '').trim();

if (veroeffentlichung && !angefordert) {
  throw new Error(
    'Die Variable TUTORIALS ist nicht gesetzt.\n' +
      'Ohne sie ist nicht entscheidbar, was veröffentlicht werden soll —\n' +
      'und alles zu veröffentlichen wäre die falsche Vermutung.\n' +
      'Anlegen unter: Settings → Secrets and variables → Actions → Variables',
  );
}

const gewuenscht = angefordert
  .split(',')
  .map((eintrag) => eintrag.trim())
  .filter(Boolean);

// Unbekannte Ids sind fast immer Tippfehler und würden sonst still verpuffen.
const unbekannt = gewuenscht.filter(
  (id) => !tutorials.some((t) => t.id === id),
);
if (unbekannt.length > 0) {
  throw new Error(
    `TUTORIALS nennt unbekannte Ids: ${unbekannt.join(', ')}\n` +
      `Bekannt sind: ${tutorials.map((t) => t.id).join(', ')}`,
  );
}

// Lokal alles, in der Veröffentlichung genau das Angeforderte.
const freigegeben = angefordert
  ? tutorials.filter((t) => gewuenscht.includes(t.id))
  : tutorials;

// Manche Tutorials verweisen auf ihre Vorgänger. Ein Verweis auf ein nicht
// freigeschaltetes Tutorial bricht den Build ab — allerdings mit einer
// Meldung über "broken links", der man die Ursache nicht ansieht. Deshalb
// hier vorher die verständliche Fassung.
const fehlend = freigegeben.flatMap((t) =>
  (t.verweistAuf || [])
    .filter((id) => !freigegeben.some((f) => f.id === id))
    .map((id) => `${t.id} verweist auf ${id}`),
);
if (fehlend.length > 0) {
  throw new Error(
    'Es fehlen vorausgesetzte Tutorials:\n  ' +
      fehlend.join('\n  ') +
      '\n\nDie Tutorials bauen aufeinander auf und verlinken einander.\n' +
      'Schalte die genannten Vorgänger mit frei — sonst zeigen die\n' +
      'Verweise ins Leere und der Build bricht ab.\n' +
      'Beispiel: TUTORIALS=tutorial-01,tutorial-02,tutorial-04',
  );
}

console.log(
  veroeffentlichung
    ? `[tutorials] Veröffentlichung: ${freigegeben.map((t) => t.id).join(', ')}`
    : `[tutorials] Lokal — alle ${freigegeben.length} Tutorials sichtbar`,
);

module.exports = { tutorials, freigegeben };
