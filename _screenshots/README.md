# Screenshots fuer das REST-API-Tutorial (Personenverwaltung)

## Voraussetzungen
- Node.js (v24), `npm i -D playwright` und `npx playwright install chromium`
  wurden in diesem Ordner bereits ausgefuehrt.
- Die Spring-Boot-App `01-personenverwaltung` laeuft auf `http://localhost:8080`.
- In der H2-Datenbank existieren genau zwei Personen: id 1 = Anna Schmidt,
  id 2 = Ben Kaya (siehe Kommentarkopf in `shots.mjs` fuer die curl-Befehle).

## Aufruf
```
node shots.mjs
```
Idempotent: vorhandene PNGs werden ueberschrieben. Am Ende zeigt die Konsole
eine Zusammenfassung mit Dateiname und Pixelmassen.

## Was die Bilder zeigen
1. `01-initializr.png` - Spring Initializr mit Maven, Java 25, Spring Boot
   4.1.0, Group `de.szut`, Artifact `personenverwaltung` und den vier
   Abhaengigkeiten (Web, Data JPA, H2, Actuator).
2. `02-welcome.png` - GET `/api/v1/welcome`.
3. `03-persons.png` - GET `/api/v1/persons` (Anna Schmidt, Ben Kaya).
4. `04-problem-404.png` - GET `/api/v1/persons/99`, RFC-9457-Fehlerantwort.
5. `05-actuator-health.png` - GET `/actuator/health`.
6. `06-h2-login.png` - H2-Console-Login (JDBC URL `jdbc:h2:mem:persondb`).
7. `07-h2-query.png` - H2-Console nach `SELECT * FROM PERSON` (2 Zeilen).
