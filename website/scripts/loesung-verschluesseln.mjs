/**
 * Erzeugt die verschlüsselte Musterlösung für ein Arbeitsblatt.
 *
 * Der Quelltext wird NICHT von Hand in die Arbeitsblätter kopiert, sondern
 * direkt aus dem Referenzprojekt gelesen. Damit kann die Lösung gar nicht
 * mehr vom lauffähigen Projekt abweichen — man muss nur dieses Skript
 * erneut laufen lassen:
 *
 *     node scripts/loesung-verschluesseln.mjs
 *
 * Warum verschlüsselt und nicht nur ausgeblendet?
 * Eine Abfrage, die den Text nur versteckt, ist keine: Er stünde weiterhin
 * im Seitenquelltext und wäre mit Strg+U zu finden. Hier landet nur der
 * Geheimtext in der Seite; ohne das Passwort ist daraus nichts zu machen.
 *
 * Verfahren: PBKDF2 (SHA-256, 250 000 Runden) leitet aus dem Passwort einen
 * Schlüssel ab, AES-GCM verschlüsselt damit. Beides steckt in der Web-Crypto-
 * Schnittstelle, die jeder Browser mitbringt — keine zusätzliche Bibliothek.
 */

import {webcrypto} from 'node:crypto';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = resolve(hier, '..', '..');

const RUNDEN = 250000;

/** Was für welches Arbeitsblatt verschlüsselt wird. */
const aufgaben = [
  {
    ziel: 'src/data/loesung-tutorial-01.json',
    passwort: 'solution',
    projekt: '01-personenverwaltung',
    dateien: [
      'src/main/java/de/szut/personenverwaltung/model/Person.java',
      'src/main/java/de/szut/personenverwaltung/repository/PersonRepository.java',
      'src/main/java/de/szut/personenverwaltung/controller/PersonController.java',
      'src/main/java/de/szut/personenverwaltung/controller/Greeting.java',
      'src/main/java/de/szut/personenverwaltung/controller/WelcomeController.java',
      'src/main/resources/application.properties',
      'requests.http',
    ],
  },
];

const sprachen = {
  java: 'java',
  properties: 'properties',
  http: 'http',
};

function spracheZu(pfad) {
  const endung = pfad.split('.').pop();
  return sprachen[endung] ?? 'text';
}

async function schluesselAus(passwort, salz) {
  const roh = await webcrypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passwort),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return webcrypto.subtle.deriveKey(
    {name: 'PBKDF2', salt: salz, iterations: RUNDEN, hash: 'SHA-256'},
    roh,
    {name: 'AES-GCM', length: 256},
    false,
    ['encrypt'],
  );
}

for (const aufgabe of aufgaben) {
  const dateien = aufgabe.dateien.map((pfad) => ({
    pfad,
    sprache: spracheZu(pfad),
    inhalt: readFileSync(resolve(wurzel, aufgabe.projekt, pfad), 'utf8')
      // Zeilenenden vereinheitlichen, damit Windows und Linux dasselbe erzeugen
      .replace(/\r\n/g, '\n')
      .trimEnd(),
  }));

  const klartext = new TextEncoder().encode(JSON.stringify({dateien}));
  const salz = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const schluessel = await schluesselAus(aufgabe.passwort, salz);

  const geheim = new Uint8Array(
    await webcrypto.subtle.encrypt({name: 'AES-GCM', iv}, schluessel, klartext),
  );

  const b64 = (bytes) => Buffer.from(bytes).toString('base64');
  const ergebnis = {
    hinweis:
      'Erzeugt von scripts/loesung-verschluesseln.mjs — nicht von Hand ändern.',
    runden: RUNDEN,
    salz: b64(salz),
    iv: b64(iv),
    geheimtext: b64(geheim),
  };

  const zielpfad = resolve(hier, '..', aufgabe.ziel);
  mkdirSync(dirname(zielpfad), {recursive: true});
  writeFileSync(zielpfad, JSON.stringify(ergebnis, null, 2) + '\n', 'utf8');

  console.log(
    `${aufgabe.ziel}: ${dateien.length} Dateien, ` +
      `${klartext.length} Zeichen -> ${geheim.length} Byte Geheimtext`,
  );
}
