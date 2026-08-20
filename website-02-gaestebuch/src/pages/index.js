import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// Kartenliste für den Abschnitt "Arbeitsblätter".
const arbeitsblaetter = [
  {
    nummer: '01',
    titel: 'Projekt und Modell',
    stichworte: 'Lombok · Entität · dateibasierte Datenbank · IDENTITY',
    link: '/docs/arbeitsblaetter/01-projekt-und-modell',
  },
  {
    nummer: '02',
    titel: 'Antworten gestalten',
    stichworte: 'ResponseEntity · Location-Header · Statuscodes · Postman',
    link: '/docs/arbeitsblaetter/02-antworten-gestalten',
  },
  {
    nummer: '03',
    titel: 'Suchen und filtern',
    stichworte: 'Abgeleitete Abfragen · Request-Parameter · Paginierung',
    link: '/docs/arbeitsblaetter/03-suchen-und-filtern',
  },
  {
    nummer: '04',
    titel: 'Die API dokumentieren',
    stichworte: 'OpenAPI · Swagger-UI · springdoc',
    link: '/docs/arbeitsblaetter/04-api-dokumentieren',
  },
];

// Linkliste für den Abschnitt "Infoblätter".
const infoblaetter = [
  {
    titel: 'Was ist ein Webservice?',
    beschreibung: 'Programme, die mit Programmen reden — und warum das etwas anderes ist als eine Webseite',
    link: '/docs/infoblaetter/webservices',
  },
  {
    titel: 'Das REST-Paradigma',
    beschreibung: 'Ressourcen statt Funktionen, die sechs Prinzipien, Idempotenz — und die Abgrenzung zu SOAP',
    link: '/docs/infoblaetter/rest-paradigma',
  },
  {
    titel: 'HTTP kompakt',
    beschreibung: 'Aufbau von Anfrage und Antwort, Methoden, Statuscodes, Header',
    link: '/docs/infoblaetter/http-kompakt',
  },
  {
    titel: 'JSON',
    beschreibung: 'Aufbau des Datenformats, Abbildung auf Java-Typen, Serialisierung und typische Fehler',
    link: '/docs/infoblaetter/json',
  },
  {
    titel: 'Maven und Abhängigkeiten',
    beschreibung: 'pom.xml, GAV-Koordinaten, transitive Abhängigkeiten, Starter und der Maven Wrapper',
    link: '/docs/infoblaetter/maven',
  },
  {
    titel: 'JPA und Hibernate',
    beschreibung: 'Objektrelationales Mapping, der Unterschied zwischen JPA, Hibernate und Spring Data, die Entität',
    link: '/docs/infoblaetter/jpa-hibernate',
  },
  {
    titel: 'Testfälle formulieren',
    beschreibung: 'Äquivalenzklassen, Grenzwerte und was man an einer REST-Schnittstelle prüft',
    link: '/docs/infoblaetter/testfaelle',
  },
  {
    titel: 'Lombok',
    beschreibung: 'Boilerplate beim Kompilieren erzeugen — und wo @Data gefährlich wird',
    link: '/docs/infoblaetter/lombok',
  },
  {
    titel: 'Abgeleitete Abfragen',
    beschreibung: 'Der Methodenname als Abfrage, die Bausteine, und wann JPQL besser ist',
    link: '/docs/infoblaetter/abgeleitete-abfragen',
  },
];

const lernziele = [
  'Lombok einsetzen und erklären, was beim Kompilieren geschieht',
  'Daten dauerhaft speichern statt nur im Hauptspeicher',
  'Antworten mit ResponseEntity vollständig gestalten — Status, Kopfzeilen und Rumpf',
  'Nach dem Anlegen einen korrekten Location-Header liefern',
  'Abgeleitete Abfragen aus Methodennamen erzeugen',
  'Filtern und Sortieren der Datenbank überlassen statt im Controller zu erledigen',
  'Ergebnisse seitenweise ausliefern',
  'Eine REST-Schnittstelle mit OpenAPI dokumentieren',
];

function ArbeitsblattCard({nummer, titel, stichworte, link}) {
  return (
    <Link to={link} className={styles.card}>
      <span className={styles.cardNummer}>{nummer}</span>
      <span className={styles.cardTitel}>{titel}</span>
      <span className={styles.cardStichworte}>{stichworte}</span>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout
      title="Gästebuch-Microservice"
      description="Lernsituation LF8 – REST-APIs mit Spring Boot (Tutorial 2)">
      <header className={styles.hero}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            Gästebuch-Microservice
          </Heading>
          <p className={styles.heroSubtitle}>
            Lernsituation LF8 – REST-APIs mit Spring Boot (Tutorial 2)
          </p>
        </div>
      </header>

      <main className="container">
        <section className={styles.section}>
          <Heading as="h2">Worum es geht</Heading>
          <p>
            Die HiTec GmbH möchte auf ihrer Website ein Gästebuch anbieten.
            Kundinnen und Kunden sollen einen kurzen Eintrag hinterlassen
            können — und die Einträge dürfen auf keinen Fall verloren gehen,
            wenn der Dienst neu gestartet wird.
          </p>
          <p>
            Dieses Tutorial baut auf der{' '}
            <b>Personenverwaltung</b> auf. Dort ging es darum, dass eine
            Schnittstelle überhaupt funktioniert. Hier geht es darum, dass sie
            gut wird: vollständige Antworten mit Kopfzeilen und passenden
            Statuscodes, dauerhafte Speicherung, Suchen und Blättern in großen
            Datenmengen — und eine Dokumentation, die nicht veralten kann.
          </p>
          <p>
            Die Arbeitsblätter werden der Reihe nach bearbeitet und enden
            jeweils mit Testfällen zur Selbstprüfung. Die Infoblätter liefern
            den fachlichen Hintergrund; die ersten sieben kennst du aus dem
            ersten Tutorial und sind hier unverändert enthalten.
          </p>
        </section>

        <section className={styles.section}>
          <Heading as="h2">Lernziele</Heading>
          <ul className={styles.linkListe}>
            {lernziele.map((z) => (
              <li key={z}>{z}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <Heading as="h2">Arbeitsblätter</Heading>
          <p>
            Arbeite die Arbeitsblätter der Reihe nach ab. Jedes enthält
            Aufgaben, die du abhaken kannst, um deinen Fortschritt zu verfolgen.
          </p>
          <div className={styles.cardGrid}>
            {arbeitsblaetter.map((item) => (
              <ArbeitsblattCard key={item.nummer} {...item} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <Heading as="h2">Infoblätter</Heading>
          <p>Begleitende Informationen zu den fachlichen Grundlagen:</p>
          <ul className={styles.linkListe}>
            {infoblaetter.map((item) => (
              <li key={item.titel}>
                <Link to={item.link}>
                  <strong>{item.titel}</strong>
                </Link>
                {' – '}
                {item.beschreibung}
              </li>
            ))}
          </ul>
        </section>

        <section id="impressum" className={styles.section}>
          <Heading as="h2">Impressum</Heading>
          <p>
            Diese Seite ist Teil einer schulischen Lernsituation im
            Bildungsgang Fachinformatiker/in – Anwendungsentwicklung am
            Schulzentrum Utbremen, Bremen.
          </p>
          <p>
            Verantwortlich im Sinne des § 5 DDG ist das Schulzentrum Utbremen.
            Vollständiges Impressum:{' '}
            <Link to="https://www.szut.de/impressum.html">
              szut.de/impressum.html
            </Link>
          </p>
          <p>
            Diese Seite dient ausschließlich der schulischen Ausbildung und
            verfolgt keine kommerziellen Zwecke.
          </p>
        </section>
      </main>
    </Layout>
  );
}
