import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// Kartenliste für den Abschnitt "Arbeitsblätter".
const arbeitsblaetter = [
  {
    nummer: '01',
    titel: 'Projekt aufsetzen',
    stichworte: 'Spring Initializr · REST-Controller · Record · Actuator',
    link: '/docs/arbeitsblaetter/01-projekt-aufsetzen',
  },
  {
    nummer: '02',
    titel: 'Personen speichern',
    stichworte: 'JPA-Entität · Repository · H2 · Konstruktor-Injektion',
    link: '/docs/arbeitsblaetter/02-personen-speichern',
  },
  {
    nummer: '03',
    titel: 'CRUD vervollständigen',
    stichworte: 'PUT · DELETE · Statuscodes · Idempotenz · Testfälle',
    link: '/docs/arbeitsblaetter/03-crud-vervollstaendigen',
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
];

const lernziele = [
  'Aufbau und Zweck eines Webservice erklären',
  'Das REST-Paradigma anwenden und von SOAP abgrenzen',
  'HTTP-Methoden und Statuscodes bewusst einsetzen',
  'Ein Spring-Boot-Projekt aufsetzen und strukturieren',
  'Daten über JPA und ein Repository persistieren',
  'Dependency Injection über den Konstruktor anwenden',
  'Testfälle systematisch formulieren und ausführen',
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
      title="REST-APIs mit Spring Boot"
      description="Lernsituationen LF8 – Fachinformatiker Anwendungsentwicklung">
      <header className={styles.hero}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            REST-APIs mit Spring Boot
          </Heading>
          <p className={styles.heroSubtitle}>
            Lernsituationen LF8 – Fachinformatiker Anwendungsentwicklung
          </p>
        </div>
      </header>

      <main className="container">
        <section className={styles.section}>
          <Heading as="h2">Worum es geht</Heading>
          <p>
            In dieser Lernsituation entsteht Schritt für Schritt ein
            REST-Backend mit Spring Boot. Ausgangspunkt ist ein Auftrag aus der
            Praxis: Mehrere Programme – eine Weboberfläche, eine App und ein
            Zeiterfassungssystem – sollen auf denselben Datenbestand zugreifen.
            Statt jedes Programm eigene Wege gehen zu lassen, wird eine
            gemeinsame Schnittstelle gebaut.
          </p>
          <p>
            Die Arbeitsblätter bauen aufeinander auf und werden der Reihe nach
            bearbeitet. Jedes endet mit einer lauffähigen Anwendung und einer
            Reihe von Testfällen, mit denen du deine Arbeit selbst überprüfst.
            Die Infoblätter liefern den fachlichen Hintergrund und lassen sich
            unabhängig davon nachschlagen.
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
