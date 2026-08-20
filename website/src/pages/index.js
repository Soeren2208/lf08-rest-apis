import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Die Infoblätter sind immer erreichbar.
const infoblaetter = [
  {
    titel: 'Was ist ein Webservice?',
    beschreibung: 'Programme, die mit Programmen reden — und warum das etwas anderes ist als eine Webseite',
    link: '/infoblaetter/webservices',
  },
  {
    titel: 'Das REST-Paradigma',
    beschreibung: 'Ressourcen statt Funktionen, die sechs Prinzipien, Idempotenz — und die Abgrenzung zu SOAP',
    link: '/infoblaetter/rest-paradigma',
  },
  {
    titel: 'HTTP kompakt',
    beschreibung: 'Aufbau von Anfrage und Antwort, Methoden, Statuscodes, Header',
    link: '/infoblaetter/http-kompakt',
  },
  {
    titel: 'JSON',
    beschreibung: 'Aufbau des Datenformats, Abbildung auf Java-Typen, Serialisierung und typische Fehler',
    link: '/infoblaetter/json',
  },
  {
    titel: 'Maven und Abhängigkeiten',
    beschreibung: 'pom.xml, GAV-Koordinaten, transitive Abhängigkeiten, Starter und der Maven Wrapper',
    link: '/infoblaetter/maven',
  },
  {
    titel: 'JPA und Hibernate',
    beschreibung: 'Objektrelationales Mapping, der Unterschied zwischen JPA, Hibernate und Spring Data',
    link: '/infoblaetter/jpa-hibernate',
  },
  {
    titel: 'Testfälle formulieren',
    beschreibung: 'Äquivalenzklassen, Grenzwerte und was man an einer REST-Schnittstelle prüft',
    link: '/infoblaetter/testfaelle',
  },
  {
    titel: 'Lombok',
    beschreibung: 'Boilerplate beim Kompilieren erzeugen — und wo @Data gefährlich wird',
    link: '/infoblaetter/lombok',
  },
  {
    titel: 'Abgeleitete Abfragen',
    beschreibung: 'Der Methodenname als Abfrage, die Bausteine, und wann JPQL besser ist',
    link: '/infoblaetter/abgeleitete-abfragen',
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

function TutorialCard({nummer, titel, stichworte, link}) {
  return (
    <Link to={link} className={styles.card}>
      <span className={styles.cardNummer}>{nummer}</span>
      <span className={styles.cardTitel}>{titel}</span>
      <span className={styles.cardStichworte}>{stichworte}</span>
    </Link>
  );
}

export default function Home() {
  // Nur die freigegebenen Tutorials - gesteuert ueber tutorials.js
  const {siteConfig} = useDocusaurusContext();
  const freigegeben = siteConfig.customFields.tutorials;

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
            Die Tutorials bauen aufeinander auf und werden der Reihe nach
            bearbeitet. Jedes Arbeitsblatt endet mit einer lauffähigen
            Anwendung und Testfällen zur Selbstprüfung. Die Infoblätter liefern
            den fachlichen Hintergrund und lassen sich jederzeit nachschlagen.
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
          <Heading as="h2">Tutorials</Heading>
          <p>
            Arbeite die Tutorials der Reihe nach ab. Jedes enthält Aufgaben,
            die du abhaken kannst, um deinen Fortschritt zu verfolgen.
          </p>
          <div className={styles.cardGrid}>
            {freigegeben.map((t) => (
              <TutorialCard
                key={t.id}
                nummer={t.nummer}
                titel={t.titel}
                stichworte={t.stichworte}
                link={`/${t.id}/`}
              />
            ))}
          </div>
          <p>
            <em>
              Weitere Tutorials werden im Laufe des Schuljahres freigeschaltet.
            </em>
          </p>
        </section>

        <section className={styles.section}>
          <Heading as="h2">Infoblätter</Heading>
          <p>
            Nachschlagematerial zu den fachlichen Grundlagen — unabhängig davon,
            an welchem Tutorial du gerade arbeitest:
          </p>
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
