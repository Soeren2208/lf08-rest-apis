// @ts-check
// Konfiguration der Lernsituations-Website.
// Welche Tutorials veröffentlicht werden, steht in ./tutorials.js — nicht hier.

import {themes as prismThemes} from 'prism-react-renderer';
import {freigegeben} from './tutorials.js';

// Einmal hier, damit der Impressum-Verweis im Footer denselben Wert benutzt.
const baseUrl = '/lf08-rest-apis/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'REST-APIs mit Spring Boot',
  tagline: 'Lernsituationen LF8 – Fachinformatiker Anwendungsentwicklung',
  favicon: 'img/favicon.ico',

  // ACHTUNG: future.v4 NICHT aktivieren.
  // Mit v4:true werden Admonitions (:::info, :::tip, :::warning ...) nicht mehr
  // geparst und erscheinen als roher Text. Nachgewiesen mit Docusaurus 3.10.2.
  future: {
    v4: false,
  },

  url: 'https://soeren2208.github.io',
  baseUrl,

  organizationName: 'Soeren2208',
  projectName: 'lf08-rest-apis',

  onBrokenLinks: 'throw',
  // Bleibt auf 'ignore', und das ist eine bewusste Entscheidung:
  // Die Ankerpruefung kennt nur Ueberschriften aus Markdown. Der Footer
  // verweist auf /#impressum - ein id-Attribut in der React-Startseite
  // src/pages/index.js. Diesen funktionierenden Link meldet die Pruefung
  // auf JEDER Seite als kaputt, egal ob als 'to' oder 'href' geschrieben.
  // Mit 'throw' bricht der Build ab, mit 'warn' rauschen 20 Fehlalarme durch
  // jeden Lauf und verdecken echte Meldungen.
  //
  // Konsequenz: Wer eine Ueberschrift umbenennt, auf die verwiesen wird, muss
  // die Verweise von Hand pruefen. Betroffen sind derzeit genau zwei:
  //   /infoblaetter/http-kompakt#content-negotiation-mehrere-formate
  //   /infoblaetter/rest-paradigma#sicher-und-idempotent
  onBrokenAnchors: 'ignore',

  markdown: {
    mermaid: true,
  },

  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
  },

  // Nur die freigegebenen Tutorials werden an die Seiten weitergereicht.
  // Dadurch taucht ein noch nicht freigeschaltetes Tutorial auch nicht im
  // JavaScript im Browser auf.
  customFields: {
    tutorials: freigegeben,
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // Die Doku-Bereiche werden weiter unten einzeln als Plugins geführt,
        // damit jedes Tutorial eine eigene Adresse bekommt und einzeln
        // abschaltbar ist.
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    // Die Infoblätter sind immer erreichbar — sie sind Nachschlagematerial.
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'infoblaetter',
        path: 'docs-infoblaetter',
        routeBasePath: 'infoblaetter',
        sidebarPath: './sidebars.js',
      },
    ],
    // Für jedes freigegebene Tutorial ein eigener Bereich. Nicht freigegebene
    // Tutorials tauchen hier nicht auf und werden deshalb auch nicht gebaut —
    // ihre Adresse liefert einen 404.
    ...freigegeben.map((t) => [
      '@docusaurus/plugin-content-docs',
      {
        id: t.id,
        path: `docs-${t.id}`,
        routeBasePath: t.id,
        sidebarPath: './sidebars.js',
      },
    ]),
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'REST-APIs mit Spring Boot',
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [
          ...freigegeben.map((t) => ({
            type: 'docSidebar',
            sidebarId: 'sidebar',
            docsPluginId: t.id,
            position: 'left',
            label: `${t.nummer} ${t.titel}`,
          })),
          {
            type: 'docSidebar',
            sidebarId: 'sidebar',
            docsPluginId: 'infoblaetter',
            position: 'left',
            label: 'Infoblätter',
          },
          {
            href: 'https://github.com/Soeren2208/lf08-rest-apis',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Lernsituation',
            items: [
              ...freigegeben.map((t) => ({
                label: `${t.nummer} ${t.titel}`,
                to: `/${t.id}/`,
              })),
              {
                label: 'Infoblätter',
                to: '/infoblaetter/webservices',
              },
            ],
          },
          {
            title: 'Schule',
            items: [
              {
                label: 'Schulzentrum Utbremen',
                href: 'https://www.szut.de/',
              },
              {
                // Bewusst href statt to: Die Startseite ist eine React-Seite,
                // und die Ankerpruefung kennt nur Ueberschriften aus Markdown.
                // Mit 'to' meldet sie diesen funktionierenden Link als kaputt.
                label: 'Impressum',
                href: `${baseUrl}#impressum`,
              },
            ],
          },
        ],
        copyright: `Unterrichtsmaterial · Schulzentrum Utbremen · ${new Date().getFullYear()}`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'properties', 'sql', 'bash', 'json'],
      },
    }),
};

export default config;
