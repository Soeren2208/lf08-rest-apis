---
title: "Tutorial 02 – Gästebuch"
sidebar_label: Übersicht
slug: /
sidebar_position: 0
---

# Tutorial 02 – Gästebuch-Microservice

## Die Situation

> Die **HiTec GmbH** hat ihren Webauftritt überarbeitet. Der Marketingabteilung fehlt eine Möglichkeit für Rückmeldungen: Kundinnen und Kunden sollen einen kurzen Eintrag hinterlassen können — mit Titel, Kommentar und Namen.
>
> Dein Auftrag: Baue das **Backend** für dieses Gästebuch. Anders als bei der Personenverwaltung dürfen die Einträge auf keinen Fall verloren gehen, wenn der Dienst neu gestartet wird.

## Worin sich dieses Tutorial vom ersten unterscheidet

Im ersten Tutorial ging es darum, dass eine Schnittstelle **funktioniert**. Hier geht es darum, dass sie **gut** wird: vollständige Antworten mit Kopfzeilen und passenden Statuscodes, dauerhafte Speicherung, Suchen und Blättern in großen Datenmengen — und eine Dokumentation, die nicht veralten kann.

## Die vier Arbeitsblätter

| | Arbeitsblatt | Darum geht es |
|---|---|---|
| **01** | [Projekt und Modell](01-projekt-und-modell) | Lombok, Entität mit Zeitstempel, dateibasierte Datenbank |
| **02** | [Antworten gestalten](02-antworten-gestalten) | `ResponseEntity`, `Location`-Header, Statuscodes |
| **03** | [Die API dokumentieren](03-api-dokumentieren) | OpenAPI, springdoc, Swagger-UI |
| **04** | [Suchen und filtern](04-suchen-und-filtern) | Abgeleitete Abfragen, Request-Parameter, Paginierung |

## Was du am Ende kannst

- **Lombok** einsetzen und erklären, was beim Kompilieren geschieht
- Daten dauerhaft speichern statt nur im Hauptspeicher
- Antworten mit `ResponseEntity` vollständig gestalten
- **abgeleitete Abfragen** aus Methodennamen erzeugen
- Ergebnisse **seitenweise** ausliefern
- eine REST-Schnittstelle mit **OpenAPI** dokumentieren

:::info Voraussetzung
Dieses Tutorial setzt die [Personenverwaltung](/tutorial-01/) voraus. Du solltest einen REST-Controller, ein Repository und eine Entität bauen können.
:::
