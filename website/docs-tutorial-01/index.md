---
title: "Tutorial 01 – Personenverwaltung"
sidebar_label: Übersicht
slug: /
sidebar_position: 0
---

# Tutorial 01 – Personenverwaltung

## Die Situation

> Die Personalabteilung der **HiTec GmbH** verwaltet ihre Mitarbeiterdaten bislang in einer Tabellenkalkulation. Künftig sollen mehrere Programme darauf zugreifen: die neue Weboberfläche, eine App für das Außendienstteam und die Zeiterfassung an der Pforte.
>
> Dein Auftrag: Baue ein **Backend**, das die Personendaten verwaltet und sie allen drei Programmen über eine einheitliche Schnittstelle zur Verfügung stellt.

## Die drei Arbeitsblätter

Arbeite sie der Reihe nach ab. Jedes endet mit einer lauffähigen Anwendung und Testfällen, mit denen du deine Arbeit selbst überprüfst.

| | Arbeitsblatt | Darum geht es |
|---|---|---|
| **01** | [Projekt aufsetzen](01-projekt-aufsetzen) | Projekt erzeugen, erster REST-Endpunkt, Record, Actuator |
| **02** | [Personen speichern](02-personen-speichern) | Entität, Repository, H2-Datenbank, Konstruktor-Injektion |
| **03** | [CRUD vervollständigen](03-crud-vervollstaendigen) | Ändern und Löschen, Statuscodes, Idempotenz |

## Was du am Ende kannst

- ein Spring-Boot-Projekt aufsetzen und seinen Aufbau erklären
- Daten über JPA und ein Repository speichern und wieder auslesen
- REST-Endpunkte für alle vier CRUD-Operationen bauen
- passende HTTP-Statuscodes wählen und begründen
- deine Schnittstelle mit Testfällen systematisch prüfen

:::tip Vorwissen zum Nachschlagen
Beginne mit den Infoblättern [Was ist ein Webservice?](/infoblaetter/webservices) und [Das REST-Paradigma](/infoblaetter/rest-paradigma). Für den Aufbau der Nachrichten hilft [HTTP kompakt](/infoblaetter/http-kompakt).
:::
