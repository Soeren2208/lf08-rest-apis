---
title: "Tutorial 05 – Währungsumrechnung"
sidebar_label: Übersicht
slug: /
sidebar_position: 0
---

# Tutorial 05 – Währungsumrechnung

## Die Situation

> Die **HiTec GmbH** verkauft jetzt auch außerhalb der Eurozone. Aus der Einkaufsabteilung kommt eine neue Anforderung:
>
> *„Kundinnen und Kunden aus dem Ausland sollen den Preis eines Artikels in ihrer eigenen Währung sehen können — ohne dass sie selbst umrechnen müssen."*
>
> In der Datenbank soll sich dabei nichts ändern: Gespeichert wird weiterhin ausschließlich in Euro. Umgerechnet wird erst für die Antwort, und zwar mit einem **aktuellen** Kurs — den holt sich dein Backend live von einem fremden Dienst.

## Was hier neu ist

Bisher hat dein Backend ausschließlich geantwortet — auf Anfragen von Postman, `requests.http` oder einem Browser. Jetzt wird es selbst zum Anfragenden:

- Dein Backend ruft **einen fremden Server** auf, um an Daten zu kommen, die es selbst nicht hat.
- Die Antwort einer fremden API wird wie jede JSON-Antwort an ein DTO gebunden — nur mit einer Absicherung mehr, weil du ihr Format nicht selbst bestimmst.
- Ein Fehler der fremden API wird an der Aufrufstelle in eine eigene fachliche Ausnahme übersetzt.

## Die Anforderung

> **Als** Kundin oder Kunde aus dem Ausland **möchte ich** den Preis eines Artikels in meiner eigenen Währung sehen, **damit** ich ihn ohne eigene Umrechnung einschätzen kann.

| # | Akzeptanzkriterium |
|---|---|
| A_1 | Es gibt einen Endpunkt, der einen einzelnen Artikel anhand seiner Kennung liefert. |
| A_2 | Der Endpunkt akzeptiert einen optionalen Query-Parameter `currency` mit einem Währungscode. |
| A_3 | Ohne `currency`-Parameter enthält die Antwort den unveränderten Preis aus der Datenbank und den Währungscode `EUR`. |
| A_4 | Mit einem gültigen, von `EUR` abweichenden Währungscode enthält die Antwort den zum aktuellen Kurs umgerechneten Preis und den angegebenen Währungscode. |
| A_5 | Mit einem Währungscode, den die Umrechnungs-API nicht kennt, antwortet die Anwendung mit Statuscode 404 und einer Meldung, die den ungültigen Code erkennen lässt. |
| A_6 | In der Datenbank steht weiterhin ausschließlich der Preis in EUR — die Umrechnung verändert keinen gespeicherten Wert. |
| A_7 | Der Endpunkt, der alle Artikel eines Lieferanten auflistet, unterstützt denselben `currency`-Parameter für alle Artikel gleichzeitig. |

## Das Arbeitsblatt

| | Arbeitsblatt | Darum geht es |
|---|---|---|
| **01** | [Währungsumrechnung](01-waehrungsumrechnung) | Eine fremde API aufrufen, ihre Antwort abbilden, ihre Fehler übersetzen |

## Was du am Ende kannst

- mit **`RestClient`** einen fremden HTTP-Dienst aus deinem Backend heraus aufrufen
- die Antwort einer fremden API mit `@JsonIgnoreProperties(ignoreUnknown = true)` an ein eigenes DTO binden
- einen Fehler einer fremden API (`HttpClientErrorException`) in eine eigene fachliche Ausnahme übersetzen
- begründen, warum ein solcher Aufruf in den Service gehört und nicht in den Controller
- eine Anforderung als **User Story mit Akzeptanzkriterien** lesen und gegen den eigenen Code prüfen

:::tip Vorwissen zum Nachschlagen
Dieses Tutorial setzt [Tutorial 04 – Webshop](/tutorial-04/) voraus: Entität, DTO, Mapper, Service-Schicht, `ApiExceptionHandler`. Neu ist ausschließlich der Aufruf einer fremden API — alles andere daran ist dir schon vertraut.

Zum Nachschlagen: [Fremde APIs aufrufen](/infoblaetter/fremde-apis-aufrufen) · [DTOs und Schichten](/infoblaetter/dto-schichten) · [Fehlerantworten](/infoblaetter/fehlerantworten)
:::
