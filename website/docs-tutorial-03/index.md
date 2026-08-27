---
title: "Tutorial 03 – Das Gästebuch testen"
sidebar_label: Übersicht
slug: /
sidebar_position: 0
---

# Tutorial 03 – Das Gästebuch testen

## Die Situation

> Das Gästebuch der **HiTec GmbH** läuft. Beim letzten Rollout ging trotzdem etwas schief: Ein Kollege hatte den Jahresfilter geändert, und plötzlich tauchten Einträge in zwei Jahren gleichzeitig auf. Aufgefallen ist es einer Kundin — drei Wochen später.
>
> In der Nachbesprechung fällt der Satz, der dieses Tutorial auslöst:
>
> *„Wir haben nach jeder Änderung von Hand geklickt. Das hält niemand durch."*
>
> Dein Auftrag: Sichere das Gästebuch mit **automatischen Tests** ab — so, dass ein Fehler wie dieser beim nächsten Mal in Sekunden auffällt statt in Wochen.

## Ein Tutorial ohne neue Endpunkte

Dieses Tutorial baut keine neue Schnittstelle. Es geht um die Frage, die danach kommt: **Woher weißt du, dass dein Code tut, was du glaubst?**

Dabei wird das Gästebuch trotzdem umgebaut — an zwei Stellen, und beide Male, weil das Testen es verlangt:

- Die Fachlichkeit bekommt eine eigene **Service-Schicht**. Erst dadurch gibt es überhaupt etwas, das sich einzeln prüfen lässt.
- Das Anlegedatum wird anders gesetzt. Warum, findest du in Arbeitsblatt 03 selbst heraus — und zwar so, wie man solche Dinge im Betrieb herausfindet: Ein Test lässt sich nicht schreiben.

## Die vier Arbeitsblätter

| | Arbeitsblatt | Darum geht es |
|---|---|---|
| **01** | [Fachlichkeit und Unit-Tests](01-service-und-unittests) | Service-Schicht, JUnit, Arrange-Act-Assert, Grenzwerte, Mocks |
| **02** | [Den Controller allein testen](02-controller-testen) | `@WebMvcTest`, `MockMvc`, `@MockitoBean` |
| **03** | [Die Datenbank allein testen](03-datenbank-testen) | `@DataJpaTest`, `TestEntityManager` — und ein Entwurfsfehler |
| **04** | [Die Testpyramide](04-testpyramide) | Welcher Test wofür, Abdeckung, was man nicht testet |

## Was du am Ende kannst

- Fachlichkeit von HTTP und Datenbank trennen und begründen, warum das dem Testen dient
- Unit-Tests nach **Arrange-Act-Assert** schreiben und mit `@ParameterizedTest` Grenzwerte prüfen
- ein **Test-Doppel** einsetzen und erklären, was dadurch *nicht* mehr geprüft wird
- **Slice-Tests** für Web- und Datenbankschicht schreiben und die richtige Schicht auswählen
- an einem fehlgeschlagenen Test erkennen, ob der Test oder der Code falsch ist
- beurteilen, was eine Testabdeckung aussagt — und was nicht

:::tip Vorwissen zum Nachschlagen
Dieses Tutorial setzt das [Gästebuch](/tutorial-02/) voraus. Du arbeitest **in deinem vorhandenen Projekt weiter** — es wird kein neues angelegt.

Für die Testfälle hilft das Infoblatt [Testfälle formulieren](/infoblaetter/testfaelle): Äquivalenzklassen und Grenzwertanalyse sind hier keine Theorie mehr, sondern das Werkzeug, mit dem du die Testmethoden auswählst.
:::
