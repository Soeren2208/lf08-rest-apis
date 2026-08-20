// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'REST-APIs mit Spring Boot',
  tagline: 'Lernsituationen LF8 – Fachinformatiker Anwendungsentwicklung',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  // ACHTUNG: future.v4 NICHT aktivieren.
  // Mit v4:true werden Admonitions (:::info, :::tip, :::warning ...) nicht mehr
  // geparst und erscheinen als roher Text. Nachgewiesen mit Docusaurus 3.10.2.
  future: {
    v4: false,
  },

  // Produktions-URL der Seite.
  // Lokal ist das für den Build/Preview unerheblich; für ein echtes Deployment
  // auf GitHub Pages anpassen (siehe Hinweis unten bei baseUrl).
  url: 'https://soeren2208.github.io',
  // Pfad, unter dem die Seite ausgeliefert wird.
  // Lokal reicht '/'. Für GitHub Pages unter
  // https://<org>.github.io/<repo>/ muss baseUrl auf '/<repo>/' gesetzt
  // und organizationName/projectName unten auf die echten GitHub-Werte
  // angepasst werden (z.B. baseUrl: '/rest-apis-spring-boot/').
  baseUrl: '/lf08-rest-apis/tutorial-01/',

  // GitHub pages deployment config.
  // Platzhalter — bei echtem GitHub-Pages-Deployment auf den tatsächlichen
  // Organisations-/Repo-Namen anpassen.
  organizationName: 'Soeren2208',
  projectName: 'lf08-rest-apis',

  // 'warn' statt 'throw', solange noch nicht alle Seiten existieren
  // (Platzhalter-Inhalte werden vom Orchestrator ergänzt).
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'ignore',

  markdown: {
    mermaid: true,
  },

  // Auch wenn keine Internationalisierung genutzt wird, steuert dieses Feld
  // nützliche Metadaten wie html lang.
  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'REST-APIs mit Spring Boot',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'arbeitsblaetterSidebar',
            position: 'left',
            label: 'Arbeitsblätter',
          },
          {
            type: 'docSidebar',
            sidebarId: 'infoblaetterSidebar',
            position: 'left',
            label: 'Infoblätter',
          },
          {
            href: 'https://github.com/example-org/rest-apis-spring-boot',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Lernsituation',
            items: [
              {
                label: 'Arbeitsblätter',
                to: '/docs/arbeitsblaetter/01-projekt-aufsetzen',
              },
              {
                label: 'Infoblätter',
                to: '/docs/infoblaetter/webservices',
              },
            ],
          },
          {
            title: 'Rechtliches',
            items: [
              {
                label: 'Impressum',
                to: '/#impressum',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Berufsschule – REST-APIs mit Spring Boot (LF8).`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
