// ===========================================================================
//  HIER SCHALTEST DU DIE TUTORIALS FREI
// ===========================================================================
//
//  veroeffentlicht: false  ->  Das Tutorial wird gar nicht erst gebaut.
//                             Die Adresse liefert einen 404 - auch für
//                             jemanden, der sie errät.
//
//  veroeffentlicht: true   ->  Das Tutorial erscheint auf der Startseite
//                             und in der Navigationsleiste.
//
//  Nach einer Änderung: committen und pushen. Die Pipeline stellt die Seite
//  dann in etwa zwei Minuten neu bereit.
//
//  Die Infoblätter sind NICHT geschaltet - sie sind Nachschlagematerial und
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
    veroeffentlicht: true,
  },
  {
    id: 'tutorial-02',
    nummer: '02',
    titel: 'Gästebuch',
    stichworte: 'Lombok · ResponseEntity · Paginierung · OpenAPI',
    beschreibung:
      'Die Schnittstelle wird gut: vollständige Antworten, dauerhafte ' +
      'Speicherung, Suchen und Blättern, dokumentiert mit OpenAPI.',
    veroeffentlicht: false,
  },
];

const freigegeben = tutorials.filter((t) => t.veroeffentlicht);

module.exports = { tutorials, freigegeben };
