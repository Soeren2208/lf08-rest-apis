/**
 * Erzeugt die Musterlösung für ein Arbeitsblatt.
 *
 * Der Quelltext wird NICHT von Hand in die Arbeitsblätter kopiert, sondern
 * direkt aus dem Referenzprojekt gelesen. Damit kann die Lösung gar nicht
 * mehr vom lauffähigen Projekt abweichen — man muss nur dieses Skript
 * erneut laufen lassen:
 *
 *     node scripts/loesung-generieren.mjs
 */

import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = resolve(hier, '..', '..');

/** Was für welches Arbeitsblatt zusammengestellt wird. */
const aufgaben = [
  {
    ziel: 'src/data/loesung-tutorial-01.json',
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
    projekt: '04-webshop',
    dateien: [
      // Modell
      'src/main/java/de/szut/webshop/contact/Contact.java',
      'src/main/java/de/szut/webshop/supplier/Supplier.java',
      'src/main/java/de/szut/webshop/article/Article.java',
      // Datenzugriff
      'src/main/java/de/szut/webshop/supplier/SupplierRepository.java',
      'src/main/java/de/szut/webshop/article/ArticleRepository.java',
      // DTOs
      'src/main/java/de/szut/webshop/contact/ContactDto.java',
      'src/main/java/de/szut/webshop/supplier/SupplierDto.java',
      'src/main/java/de/szut/webshop/article/ArticleDto.java',
      'src/main/java/de/szut/webshop/contact/CreateContactDto.java',
      'src/main/java/de/szut/webshop/supplier/CreateSupplierDto.java',
      'src/main/java/de/szut/webshop/article/CreateArticleDto.java',
      // Fachlichkeit
      'src/main/java/de/szut/webshop/supplier/SupplierMapper.java',
      'src/main/java/de/szut/webshop/article/ArticleMapper.java',
      'src/main/java/de/szut/webshop/supplier/SupplierNotFoundException.java',
      'src/main/java/de/szut/webshop/supplier/SupplierHasArticlesException.java',
      'src/main/java/de/szut/webshop/supplier/SupplierService.java',
      'src/main/java/de/szut/webshop/article/ArticleService.java',
      // Web
      'src/main/java/de/szut/webshop/supplier/SupplierController.java',
      'src/main/java/de/szut/webshop/article/ArticleController.java',
      'src/main/java/de/szut/webshop/common/ApiExceptionHandler.java',
      // Betrieb
      'src/main/resources/application.properties',
      'docker-compose.yml',
      'requests.http',
    ],
  },
  {
    ziel: 'src/data/loesung-tutorial-04-tests.json',
    projekt: '04-webshop',
    dateien: [
      'src/test/java/de/szut/webshop/article/ArticleMapperTest.java',
      'src/test/java/de/szut/webshop/supplier/SupplierServiceTest.java',
      'src/test/java/de/szut/webshop/supplier/SupplierControllerTest.java',
      'src/test/java/de/szut/webshop/supplier/SupplierRepositoryTest.java',
      'src/test/java/de/szut/webshop/SupplierIntegrationTest.java',
    ],
  },
  {
    ziel: 'src/data/loesung-tutorial-05.json',
    projekt: '05-waehrungsumrechnung',
    dateien: [
      // Modell
      'src/main/java/de/szut/webshop/contact/Contact.java',
      'src/main/java/de/szut/webshop/supplier/Supplier.java',
      'src/main/java/de/szut/webshop/article/Article.java',
      // Datenzugriff
      'src/main/java/de/szut/webshop/supplier/SupplierRepository.java',
      'src/main/java/de/szut/webshop/article/ArticleRepository.java',
      // DTOs
      'src/main/java/de/szut/webshop/contact/ContactDto.java',
      'src/main/java/de/szut/webshop/supplier/SupplierDto.java',
      'src/main/java/de/szut/webshop/article/ArticleDto.java',
      'src/main/java/de/szut/webshop/contact/CreateContactDto.java',
      'src/main/java/de/szut/webshop/supplier/CreateSupplierDto.java',
      'src/main/java/de/szut/webshop/article/CreateArticleDto.java',
      'src/main/java/de/szut/webshop/exchangerate/RateDto.java',
      // Fachlichkeit
      'src/main/java/de/szut/webshop/supplier/SupplierMapper.java',
      'src/main/java/de/szut/webshop/article/ArticleMapper.java',
      'src/main/java/de/szut/webshop/supplier/SupplierNotFoundException.java',
      'src/main/java/de/szut/webshop/supplier/SupplierHasArticlesException.java',
      'src/main/java/de/szut/webshop/article/ArticleNotFoundException.java',
      'src/main/java/de/szut/webshop/exchangerate/CurrencyNotFoundException.java',
      'src/main/java/de/szut/webshop/supplier/SupplierService.java',
      'src/main/java/de/szut/webshop/article/ArticleService.java',
      'src/main/java/de/szut/webshop/exchangerate/ExchangerateService.java',
      // Web
      'src/main/java/de/szut/webshop/supplier/SupplierController.java',
      'src/main/java/de/szut/webshop/article/ArticleController.java',
      'src/main/java/de/szut/webshop/common/ApiExceptionHandler.java',
      // Betrieb
      'src/main/resources/application.properties',
      'docker-compose.yml',
      'requests.http',
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

for (const aufgabe of aufgaben) {
  const dateien = aufgabe.dateien.map((pfad) => ({
    pfad,
    sprache: spracheZu(pfad),
    inhalt: readFileSync(resolve(wurzel, aufgabe.projekt, pfad), 'utf8')
      // Zeilenenden vereinheitlichen, damit Windows und Linux dasselbe erzeugen
      .replace(/\r\n/g, '\n')
      .trimEnd(),
  }));

  const ergebnis = {
    hinweis: 'Erzeugt von scripts/loesung-generieren.mjs — nicht von Hand ändern.',
    dateien,
  };

  const zielpfad = resolve(hier, '..', aufgabe.ziel);
  mkdirSync(dirname(zielpfad), {recursive: true});
  writeFileSync(zielpfad, JSON.stringify(ergebnis, null, 2) + '\n', 'utf8');

  console.log(`${aufgabe.ziel}: ${dateien.length} Dateien`);
}
