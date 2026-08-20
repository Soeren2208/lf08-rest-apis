import { chromium } from 'playwright';

const OUT = 'C:\\Users\\sschw\\AppData\\Local\\Temp\\claude\\C--Users-sschw-Lernfeld-8-Lernsituationen-02-REST-APIs-erstellen-Neuentwicklung\\31b4de08-5a57-4811-b8b4-ff52fde63154\\scratchpad\\';

const seiten = [
  { url: 'http://localhost:3000/lf08-rest-apis/tutorial-01/01-projekt-aufsetzen', name: 'ab01' },
  { url: 'http://localhost:3000/lf08-rest-apis/tutorial-01/02-personen-speichern', name: 'ab02' },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewportSize: { width: 1280, height: 900 }, deviceScaleFactor: 2 });

for (const modus of ['light', 'dark']) {
  for (const s of seiten) {
    await page.goto(s.url, { waitUntil: 'networkidle' });
    await page.evaluate((m) => document.documentElement.setAttribute('data-theme', m), modus);
    await page.waitForTimeout(900);

    const svgs = await page.$$('article svg[viewBox][role="img"]');
    for (let i = 0; i < svgs.length; i++) {
      const datei = `${OUT}dia-${s.name}-${modus}-${i + 1}.png`;
      await svgs[i].screenshot({ path: datei });
      const box = await svgs[i].boundingBox();
      console.log(`${s.name} ${modus} #${i + 1}  ${Math.round(box.width)}x${Math.round(box.height)}`);
    }
  }
}

await browser.close();
console.log('fertig');
