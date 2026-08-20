// Fotografiert alle handgezeichneten Diagramme der Infoblätter in Hell und Dunkel.
//
// Aufruf:
//   node infoblaetter.mjs            alle Infoblätter
//   node infoblaetter.mjs json       nur ein bestimmtes
//
// Die Bilder landen im Temp-Ordner (siehe OUT) und dienen nur der Sichtprüfung.
//
// ---------------------------------------------------------------------------
// Vorbereitung: eine Vorschau unter dem PRODUKTIV-Pfad
// ---------------------------------------------------------------------------
// Die Website ist auf baseUrl "/lf08-rest-apis/" eingestellt. "npx serve build"
// liefert sie aber unter "/" aus - dann findet die Seite ihr CSS nicht und die
// Farben stimmen nicht. Abhilfe: einmalig eine Verzeichnisverknuepfung anlegen
// (Windows, im Projektstamm):
//
//   mkdir _serve
//   mklink /J _serve\lf08-rest-apis website\build
//
// Danach aus dem Ordner _serve heraus servieren:
//
//   npx serve . -l 3000
//
// Der Ordner _serve steht in der .gitignore und gehoert nicht ins Repository.
// Vor jedem Lauf sollte die Website frisch gebaut sein (npm run build).
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

const OUT = 'C:\\Users\\sschw\\AppData\\Local\\Temp\\claude\\C--Users-sschw-Lernfeld-8-Lernsituationen-02-REST-APIs-erstellen-Neuentwicklung\\31b4de08-5a57-4811-b8b4-ff52fde63154\\scratchpad\\';
const BASIS = 'http://localhost:3000/lf08-rest-apis/infoblaetter/';

const seiten = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['webservices', 'rest-paradigma', 'http-kompakt', 'json', 'maven', 'jpa-hibernate', 'testfaelle'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewportSize: { width: 1280, height: 900 }, deviceScaleFactor: 2 });

for (const name of seiten) {
  for (const modus of ['light', 'dark']) {
    await page.goto(BASIS + name, { waitUntil: 'networkidle' });
    await page.evaluate((m) => document.documentElement.setAttribute('data-theme', m), modus);
    await page.waitForTimeout(700);

    const svgs = await page.$$('article svg[viewBox][role="img"]');
    for (let i = 0; i < svgs.length; i++) {
      const datei = `${OUT}ib-${name}-${modus}-${i + 1}.png`;
      await svgs[i].screenshot({ path: datei });
      if (modus === 'light') {
        const box = await svgs[i].boundingBox();
        console.log(`${name} #${i + 1}  ${Math.round(box.width)}x${Math.round(box.height)}`);
      }
    }
    if (modus === 'light' && svgs.length === 0) console.log(`${name}  KEIN Diagramm gefunden`);
  }
}

await browser.close();
console.log('fertig');
