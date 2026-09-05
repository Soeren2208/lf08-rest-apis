---
title: "Tutorial 04 – Webshop"
sidebar_label: Übersicht
slug: /
sidebar_position: 0
---

# Tutorial 04 – Der Webshop

## Die Situation

> Die **HiTec GmbH** verkauft künftig auch online. Das Sortiment kommt nicht aus eigener Fertigung, sondern von Lieferanten — jeder mit einer Anschrift, jeder mit eigenen Artikeln.
>
> Aus der ersten Besprechung mit der Einkaufsabteilung:
>
> *„Zu jedem Lieferanten gehört genau eine Anschrift. Und jeder Artikel kommt von genau einem Lieferanten — sonst wissen wir beim Nachbestellen nicht, wen wir anrufen."*
>
> Dazu kommt eine Vorgabe aus der IT: *„Die Datenbank läuft ab jetzt in einem Container. So wie später im Projekt auch."*
>
> Dein Auftrag: Baue das Backend für diesen Katalog.

## Was hier neu ist

Bisher stand in deiner Datenbank **eine** Tabelle. Jetzt sind es drei — und sie hängen zusammen. Das ändert mehr, als es zunächst aussieht:

- Die Datenbank ist eine **PostgreSQL im Docker-Container**, keine H2 mehr. Du schaust mit dem Datenbank-Werkzeug von IntelliJ hinein — so wie du es bei der Maklerdatenbank getan hast, nur dass die Tabellen diesmal aus deinem Java-Code entstehen.
- Deine Entitäten bekommen **Beziehungen**. Und du wirst erleben, dass ein Endpunkt, der gestern noch lief, davon kaputtgeht — ohne dass du ihn angefasst hast.
- Die Antwort der Schnittstelle wird nicht mehr die Entität sein, sondern ein eigens dafür entworfenes Objekt: ein **DTO**.
- Am Ende steht eine **Service-Schicht** zwischen Controller und Repository — mit einer fachlichen Regel, die nirgendwo sonst hingehört.

Es geht in diesem Tutorial **nicht** darum, möglichst viele Endpunkte zu bauen. Es sind sechs, und jeder einzelne ist da, weil er etwas zeigt.

## Die Arbeitsblätter

| | Arbeitsblatt | Darum geht es |
|---|---|---|
| **01** | [Die Datenbank zieht um](01-datenbank-im-container) | Docker, PostgreSQL, IntelliJ-Datenbankwerkzeug, die erste Beziehung (1:1) |
| **02** | [Die zweite Beziehung](02-die-zweite-beziehung) | 1:n — und ein Endpunkt, der ohne eigenes Zutun bricht |
| **03** | [Die Antwort selbst entwerfen](03-antwort-selbst-entwerfen) | DTOs, Mapper, zwei neue Endpunkte |
| **04** | [Die Service-Schicht](04-service-schicht) | Fachlichkeit trennen, Bean Validation, 404 · 409 · 400 |
| **05** | [Den Webshop testen](05-webshop-testen) | **Zusatz** — Unit-Tests, Slice-Tests, Tests gegen die echte Datenbank |

Arbeitsblatt 05 ist ein Angebot, kein Pflichtteil. Wer das Test-Tutorial zum Gästebuch gemacht hat, findet dort alles wieder — an einem schwierigeren Gegenstand.

## Was du am Ende kannst

- eine Datenbank im **Docker-Container** starten, stoppen und mit dem Datenbankwerkzeug von IntelliJ hineinsehen
- ein **Klassendiagramm** in JPA-Entitäten übersetzen — inklusive der Frage, was die gefüllte Raute im Code bedeutet
- die Annotationen `@OneToOne`, `@OneToMany` und `@ManyToOne` einsetzen und `mappedBy` erklären
- benennen, warum eine Entität nicht als Antwort taugt — und ein **DTO** entwerfen, das taugt
- Eingaben mit **Bean Validation** prüfen lassen, statt sie von Hand abzufragen
- die Statuscodes **404**, **409** und **400** auseinanderhalten und begründen, wann welcher richtig ist
- erklären, was in einem Projekt in die Controller-, Service- und Repository-Schicht gehört

:::tip Vorwissen zum Nachschlagen
Dieses Tutorial setzt das [Gästebuch](/tutorial-02/) voraus: Entität, Repository, Controller, `ResponseEntity`, abgeleitete Abfragen. Das Test-Tutorial ist **nicht** Voraussetzung — die Service-Schicht wird hier noch einmal von Grund auf eingeführt.

Aus dem ersten Lehrjahr hilft außerdem, was du beim Planen der Maklerdatenbank über Fremdschlüssel gelernt hast — nötig ist es nicht, jeder Begriff wird hier eingeführt.

Zum Nachschlagen: [Docker und Container](/infoblaetter/docker) · [Beziehungen mit JPA](/infoblaetter/jpa-beziehungen) · [JPA und Hibernate](/infoblaetter/jpa-hibernate) · [HTTP kompakt](/infoblaetter/http-kompakt) · [Abgeleitete Abfragen](/infoblaetter/abgeleitete-abfragen)

Warum Datenbanken heute in Containern laufen und wozu man Anwendungen überhaupt
in viele kleine Dienste zerlegt, steht in den Infoblättern
[Docker und Container](/infoblaetter/docker) und
[Microservices](/infoblaetter/microservices) — beide mit Filmen zum Ansehen.
:::

:::note Was hier bewusst fehlt
Die API-Dokumentation mit OpenAPI aus [Tutorial 02](/tutorial-02/03-api-dokumentieren) kommt hier nicht vor. Sie ließe sich genauso einbauen — sie ist nur nicht das Thema. Zum Ausprobieren der Endpunkte reicht `requests.http`.
:::
