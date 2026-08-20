// shots.mjs
// -----------------------------------------------------------------------
// Erzeugt reproduzierbare Screenshots fuer das REST-API-Tutorial
// (Personenverwaltung). Aufruf:
//
//   node shots.mjs
//
// Voraussetzungen:
//   - Die Spring-Boot-App "01-personenverwaltung" laeuft bereits auf
//     http://localhost:8080 (z.B. per `mvnw spring-boot:run`).
//   - In der H2-Datenbank existieren genau zwei Personen mit id=1
//     (Anna Schmidt) und id=2 (Ben Kaya). Die Datenbank ist In-Memory,
//     nach jedem Neustart der App leer - vor dem Skript per curl neu anlegen:
//       curl -s -X POST http://localhost:8080/api/v1/persons -H "Content-Type: application/json" -d "{\"firstname\":\"Anna\",\"surname\":\"Schmidt\"}"
//       curl -s -X POST http://localhost:8080/api/v1/persons -H "Content-Type: application/json" -d "{\"firstname\":\"Ben\",\"surname\":\"Kaya\"}"
//
// Das Skript ist idempotent: vorhandene PNGs im selben Ordner werden
// beim erneuten Lauf einfach ueberschrieben.
//
// Wann neu laufen lassen?
//   - Nach einem Versionswechsel von Spring Boot / Java (Screenshot 1
//     zeigt die konkrete Initializr-Konfiguration inkl. Versionsnummern).
//   - Wenn sich das Aussehen von start.spring.io, der H2-Console oder
//     der JSON-Fehlerantworten (RFC 9457) aendert.
//   - Wenn sich die Testdaten (Anna Schmidt / Ben Kaya, id 1/2) aendern.
// -----------------------------------------------------------------------

import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:8080";
const VIEWPORT = { width: 1280, height: 800 };
const DEVICE_SCALE_FACTOR = 2;

const results = [];

function outPath(name) {
  return path.join(__dirname, name);
}

async function preflightCheck() {
  try {
    const res = await fetch(`${BASE}/actuator/health`);
    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }
    const body = await res.json();
    if (body.status !== "UP") {
      throw new Error(`Health-Status ist "${body.status}", erwartet "UP"`);
    }
    console.log("Preflight OK: Spring-Boot-App laeuft und ist UP.");
  } catch (err) {
    console.error(
      "\nFEHLER: Die Spring-Boot-App ist unter " +
        `${BASE}/actuator/health nicht erreichbar (oder nicht UP).\n` +
        "Bitte zuerst die App starten (siehe Kommentarkopf dieser Datei) " +
        "und pruefen mit:\n" +
        `  curl -s ${BASE}/actuator/health\n\n` +
        `Ursache: ${err.message}\n`
    );
    process.exit(1);
  }
}

async function verifyPersons() {
  const res = await fetch(`${BASE}/api/v1/persons`);
  const persons = await res.json();
  const ids = persons.map((p) => p.id).sort((a, b) => a - b);
  if (ids.length !== 2 || ids[0] !== 1 || ids[1] !== 2) {
    console.warn(
      "\nWARNUNG: Erwartet genau zwei Personen mit id 1 und 2, gefunden: " +
        JSON.stringify(persons) +
        "\nDie Screenshots 03/07 zeigen ggf. falsche Testdaten. " +
        "Siehe Anleitung im Kopf dieser Datei, um die Testdaten neu anzulegen.\n"
    );
  } else {
    console.log("Testdaten OK: id 1 (Anna Schmidt) und id 2 (Ben Kaya) vorhanden.");
  }
}

function recordResult(filename, dims) {
  results.push({ filename, dims });
}

async function screenshotFullPage(page, filename) {
  const filePath = outPath(filename);
  await page.screenshot({ path: filePath, fullPage: true });
  const dims = await getPngDimensions(filePath);
  recordResult(filename, dims);
}

// Liest Breite/Hoehe direkt aus dem PNG-Header (IHDR-Chunk), ohne
// zusaetzliche Abhaengigkeit.
function getPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

async function shotInitializr(browser) {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
  });
  const url =
    "https://start.spring.io/#!type=maven-project&language=java&platformVersion=4.1.0" +
    "&packaging=jar&jvmVersion=25&groupId=de.szut&artifactId=personenverwaltung" +
    "&name=personenverwaltung&packageName=de.szut.personenverwaltung" +
    "&dependencies=web,data-jpa,h2,actuator";
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Spring Web", { timeout: 20000 });

  // Verifikation der gesetzten Werte per DOM-Abfrage. Falls die
  // URL-Parameter nicht greifen sollten, hier nachjustieren.
  const check = await page.evaluate(() => {
    const val = (attr) =>
      document.getElementById(`input-${attr}`)?.value ?? null;
    const radioChecked = (label) =>
      Array.from(document.querySelectorAll("a"))
        .find((a) => a.textContent.trim() === label)
        ?.className.includes("checked") ?? false;
    const depsText = document.body.innerText;
    return {
      group: val("group"),
      artifact: val("artifact"),
      packageName: val("packageName"),
      maven: radioChecked("Maven"),
      java: radioChecked("Java"),
      bootVersion: radioChecked("4.1.0"),
      javaVersion: radioChecked("25"),
      hasWeb: depsText.includes("Spring Web"),
      hasJpa: depsText.includes("Spring Data JPA"),
      hasH2: depsText.includes("H2 Database"),
      hasActuator: depsText.includes("Spring Boot Actuator"),
    };
  });

  const expected = {
    group: "de.szut",
    artifact: "personenverwaltung",
    packageName: "de.szut.personenverwaltung",
    maven: true,
    java: true,
    bootVersion: true,
    javaVersion: true,
    hasWeb: true,
    hasJpa: true,
    hasH2: true,
    hasActuator: true,
  };

  const mismatches = Object.keys(expected).filter(
    (k) => JSON.stringify(check[k]) !== JSON.stringify(expected[k])
  );

  if (mismatches.length > 0) {
    console.warn(
      "WARNUNG: Initializr-Konfiguration weicht ab bei: " +
        mismatches.join(", ") +
        ". Ist: " +
        JSON.stringify(check)
    );
  } else {
    console.log(
      "Initializr-Konfiguration verifiziert: Maven, Java, Spring Boot 4.1.0, " +
        "Java 25, de.szut/personenverwaltung, alle 4 Abhaengigkeiten vorhanden."
    );
  }

  await screenshotFullPage(page, "01-initializr.png");
  await page.close();
}

async function shotJsonPage(browser, url, filename) {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
  });
  await page.goto(url, { waitUntil: "load" });
  // Kurze Wartezeit, damit Chromium den eingebauten JSON-Viewer fertig
  // formatiert und einfaerbt (Syntax-Highlighting) hat.
  await page.waitForTimeout(300);
  await screenshotFullPage(page, filename);
  await page.close();
}

async function shotH2Console(browser) {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
  });

  await page.goto(`${BASE}/h2-console`, { waitUntil: "load" });
  await page.waitForSelector('input[name="url"]', { timeout: 10000 });

  await page.fill('input[name="url"]', "jdbc:h2:mem:persondb");
  await page.fill('input[name="user"]', "sa");
  await page.fill('input[name="password"]', "");

  // Screenshot VOR dem Connect (zeigt das ausgefuellte Login-Formular).
  await screenshotFullPage(page, "06-h2-login.png");

  // Login abschicken. H2-Console nutzt ein klassisches Formular
  // (POST auf login.do), das danach ein Frameset laedt.
  await Promise.all([
    page.waitForNavigation({ waitUntil: "load" }),
    page.click('input[type="submit"][value="Connect"], input[type="submit"]'),
  ]);

  // Warten, bis das Frameset mit dem Query-Frame ("h2query") steht.
  await page.waitForSelector('frame[name="h2query"]', { timeout: 10000 });

  const queryFrame = page.frame({ name: "h2query" });
  if (!queryFrame) {
    throw new Error("H2-Console: Frame 'h2query' nicht gefunden.");
  }
  await queryFrame.waitForSelector("#sql", { timeout: 10000 });
  await queryFrame.fill("#sql", "SELECT * FROM PERSON");

  // "Run"-Button robust suchen (Sprache kann je nach Browser-Locale
  // abweichen) - Standard-Sprache ist Englisch ("Run").
  const runClicked = await queryFrame.evaluate(() => {
    const candidates = Array.from(
      document.querySelectorAll('input[type="button"], button')
    );
    const btn = candidates.find((b) =>
      /^(run|ausf(ü|u)hren)$/i.test((b.value || b.textContent || "").trim())
    );
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  if (!runClicked) {
    throw new Error('H2-Console: "Run"-Button nicht gefunden.');
  }

  // Warten, bis das Ergebnis im Result-Frame ("h2result") erscheint.
  const resultFrame = page.frame({ name: "h2result" });
  if (!resultFrame) {
    throw new Error("H2-Console: Frame 'h2result' nicht gefunden.");
  }
  await resultFrame.waitForFunction(
    () => document.body.innerText.includes("Schmidt"),
    { timeout: 10000 }
  );

  await screenshotFullPage(page, "07-h2-query.png");
  await page.close();
}

async function main() {
  await preflightCheck();
  await verifyPersons();

  const browser = await chromium.launch();
  try {
    await shotInitializr(browser);
    await shotJsonPage(browser, `${BASE}/api/v1/welcome`, "02-welcome.png");
    await shotJsonPage(browser, `${BASE}/api/v1/persons`, "03-persons.png");
    await shotJsonPage(browser, `${BASE}/api/v1/persons/99`, "04-problem-404.png");
    await shotJsonPage(browser, `${BASE}/actuator/health`, "05-actuator-health.png");
    await shotH2Console(browser);
  } finally {
    await browser.close();
  }

  console.log("\nZusammenfassung:");
  for (const { filename, dims } of results) {
    console.log(`  ${filename} - ${dims.width}x${dims.height} px`);
  }
  console.log(`\nFertig. ${results.length} Screenshots geschrieben nach:\n  ${__dirname}`);
}

main().catch((err) => {
  console.error("\nFEHLER im Skriptlauf:", err);
  process.exit(1);
});
