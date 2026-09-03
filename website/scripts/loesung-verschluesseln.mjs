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
  {
    ziel: 'src/data/loesung-tutorial-02.json',
    passwort: 'solution',
    projekt: '02-gaestebuch',
    dateien: [
      'src/main/java/de/szut/gaestebuch/model/GuestbookEntry.java',
      'src/main/java/de/szut/gaestebuch/repository/GuestbookEntryRepository.java',
      'src/main/java/de/szut/gaestebuch/controller/GuestbookEntryController.java',
      'src/main/java/de/szut/gaestebuch/config/OpenApiConfig.java',
      'src/main/resources/application.properties',
      'requests.http',
    ],
  },
  {
    ziel: 'src/data/loesung-tutorial-03.json',
    passwort: 'solution',
    projekt: '03-gaestebuch-tests',
    dateien: [
      // Anwendung
      'src/main/java/de/szut/gaestebuch/model/GuestbookEntry.java',
      'src/main/java/de/szut/gaestebuch/repository/GuestbookEntryRepository.java',
      'src/main/java/de/szut/gaestebuch/service/CommentPreview.java',
      'src/main/java/de/szut/gaestebuch/service/InvalidEntryException.java',
      'src/main/java/de/szut/gaestebuch/service/EntryNotFoundException.java',
      'src/main/java/de/szut/gaestebuch/service/GuestbookEntryService.java',
      'src/main/java/de/szut/gaestebuch/controller/ApiExceptionHandler.java',
      'src/main/java/de/szut/gaestebuch/controller/GuestbookEntryController.java',
      // Tests
      'src/test/java/de/szut/gaestebuch/service/CommentPreviewTest.java',
      'src/test/java/de/szut/gaestebuch/service/GuestbookEntryServiceTest.java',
      'src/test/java/de/szut/gaestebuch/controller/GuestbookEntryControllerTest.java',
      'src/test/java/de/szut/gaestebuch/repository/GuestbookEntryRepositoryTest.java',
    ],
  },
  {
    ziel: 'src/data/loesung-tutorial-04.json',
    passwort: 'solution',
    projekt: '04-webshop',
    dateien: [
      // Modell
      'src/main/java/de/szut/webshop/model/Contact.java',
      'src/main/java/de/szut/webshop/model/Supplier.java',
      'src/main/java/de/szut/webshop/model/Article.java',
      // Datenzugriff
      'src/main/java/de/szut/webshop/repository/SupplierRepository.java',
      'src/main/java/de/szut/webshop/repository/ArticleRepository.java',
      // DTOs
      'src/main/java/de/szut/webshop/dto/ContactDto.java',
      'src/main/java/de/szut/webshop/dto/SupplierDto.java',
      'src/main/java/de/szut/webshop/dto/ArticleDto.java',
      'src/main/java/de/szut/webshop/dto/CreateContactDto.java',
      'src/main/java/de/szut/webshop/dto/CreateSupplierDto.java',
      'src/main/java/de/szut/webshop/dto/CreateArticleDto.java',
      // Fachlichkeit
      'src/main/java/de/szut/webshop/service/SupplierMapper.java',
      'src/main/java/de/szut/webshop/service/ArticleMapper.java',
      'src/main/java/de/szut/webshop/service/SupplierNotFoundException.java',
      'src/main/java/de/szut/webshop/service/SupplierHasArticlesException.java',
      'src/main/java/de/szut/webshop/service/SupplierService.java',
      'src/main/java/de/szut/webshop/service/ArticleService.java',
      // Web
      'src/main/java/de/szut/webshop/controller/SupplierController.java',
      'src/main/java/de/szut/webshop/controller/ArticleController.java',
      'src/main/java/de/szut/webshop/controller/ApiExceptionHandler.java',
      // Betrieb
      'src/main/resources/application.properties',
      'docker-compose.yml',
      'requests.http',
    ],
  },
  {
    ziel: 'src/data/loesung-tutorial-04-tests.json',
    passwort: 'solution',
    projekt: '04-webshop',
    dateien: [
      'src/test/java/de/szut/webshop/service/ArticleMapperTest.java',
      'src/test/java/de/szut/webshop/service/SupplierServiceTest.java',
      'src/test/java/de/szut/webshop/controller/SupplierControllerTest.java',
      'src/test/java/de/szut/webshop/repository/SupplierRepositoryTest.java',
    ],
  },
];

const sprachen = {
  java: 'java',
  properties: 'properties',
  http: 'http',
  yml: 'yaml',
  yaml: 'yaml',
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
