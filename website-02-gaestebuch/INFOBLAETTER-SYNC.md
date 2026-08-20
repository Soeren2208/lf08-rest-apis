# Infoblätter-Sync

Die sieben Infoblätter `webservices`, `rest-paradigma`, `http-kompakt`, `json`,
`maven`, `jpa-hibernate`, `testfaelle` in `docs/infoblaetter/` sind Kopien aus
dem Tutorial-1-Projekt (`../website`). Sie werden dort gepflegt.

Neu von dort übernehmen (PowerShell, aus diesem Verzeichnis):

```powershell
Copy-Item ..\website\docs\infoblaetter\webservices.md, ..\website\docs\infoblaetter\rest-paradigma.mdx, ..\website\docs\infoblaetter\http-kompakt.md, ..\website\docs\infoblaetter\json.md, ..\website\docs\infoblaetter\maven.md, ..\website\docs\infoblaetter\jpa-hibernate.md, ..\website\docs\infoblaetter\testfaelle.md -Destination docs\infoblaetter\ -Force
```

**Wichtig:** `lombok.md` und `abgeleitete-abfragen.md` existieren NUR hier
(Tutorial 2). Nicht nach Tutorial 1 zurückkopieren.
