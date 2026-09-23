---
title: Fremde APIs aufrufen
sidebar_label: Fremde APIs aufrufen
sidebar_position: 17
---

# Fremde APIs aufrufen

## Zwei Rollen für dieselbe Anwendung

Bisher war dein Backend immer **Server**: Ein Client — Postman, ein Browser, `requests.http` — hat bei dir angeklopft, und du hast geantwortet. Jetzt kommt eine zweite Rolle dazu: Dein Backend wird selbst zum **Client** eines fremden Servers.

| | Wer fragt? | Wer antwortet? |
|---|---|---|
| Bisher | ein Client | dein Backend |
| Jetzt zusätzlich | dein Backend | ein fremder Server |

<svg viewBox="0 0 720 200" width="100%" role="img"
     aria-label="Ein Client ruft links dein Backend auf und bekommt eine Antwort. Dasselbe Backend ruft rechts einen fremden Server auf, um an Daten zu kommen, die es selbst nicht hat, und bekommt von dort ebenfalls eine Antwort."
     fontFamily="var(--ifm-font-family-base)">

  <rect x="20" y="66" width="150" height="68" rx="8"
        fill="var(--ifm-color-emphasis-200)"/>
  <rect x="20" y="66" width="150" height="68" rx="8" fill="none"
        stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.6"/>
  <text x="95" y="106" textAnchor="middle" fontSize="13.5" fontWeight="700"
        fill="var(--ifm-font-color-base)">Client</text>

  <rect x="285" y="50" width="150" height="100" rx="10"
        fill="var(--ifm-color-primary)" opacity="0.10"/>
  <rect x="285" y="50" width="150" height="100" rx="10" fill="none"
        stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <text x="360" y="94" textAnchor="middle" fontSize="14" fontWeight="800"
        fill="var(--zeichnung-akzent)">dein</text>
  <text x="360" y="112" textAnchor="middle" fontSize="14" fontWeight="800"
        fill="var(--zeichnung-akzent)">Backend</text>

  <rect x="550" y="66" width="150" height="68" rx="8"
        fill="var(--ifm-color-emphasis-200)"/>
  <rect x="550" y="66" width="150" height="68" rx="8" fill="none"
        stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.6"/>
  <text x="625" y="100" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="var(--ifm-font-color-base)">fremder</text>
  <text x="625" y="118" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="var(--ifm-font-color-base)">Server</text>

  <path d="M 174 88 L 281 88" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"
        markerEnd="url(#pfeil-rollen)"/>
  <text x="228" y="78" textAnchor="middle" fontSize="10.5" fontWeight="700"
        fill="var(--ifm-color-emphasis-700)">Anfrage</text>
  <path d="M 281 112 L 174 112" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"
        markerEnd="url(#pfeil-rollen)"/>
  <text x="228" y="130" textAnchor="middle" fontSize="10.5" fontWeight="700"
        fill="var(--ifm-color-emphasis-700)">Antwort</text>

  <path d="M 439 88 L 546 88" stroke="var(--zeichnung-akzent)" strokeWidth="2"
        markerEnd="url(#pfeil-rollen)"/>
  <text x="492" y="78" textAnchor="middle" fontSize="10.5" fontWeight="700"
        fill="var(--zeichnung-akzent)">Anfrage</text>
  <path d="M 546 112 L 439 112" stroke="var(--zeichnung-akzent)" strokeWidth="2"
        markerEnd="url(#pfeil-rollen)"/>
  <text x="492" y="130" textAnchor="middle" fontSize="10.5" fontWeight="700"
        fill="var(--zeichnung-akzent)">Antwort</text>

  <defs>
    <marker id="pfeil-rollen" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
      <path d="M 0 0 L 9 4.5 L 0 9 z" fill="var(--ifm-color-emphasis-600)"/>
    </marker>
  </defs>

  <text x="95" y="168" textAnchor="middle" fontSize="11.5" fontStyle="italic"
        fill="var(--ifm-color-emphasis-700)">sieht nur die linke Seite</text>
  <text x="360" y="178" textAnchor="middle" fontSize="11.5" fontStyle="italic"
        fill="var(--ifm-color-emphasis-700)">Server für die eine Seite,</text>
  <text x="360" y="194" textAnchor="middle" fontSize="11.5" fontStyle="italic"
        fill="var(--ifm-color-emphasis-700)">Client für die andere</text>
</svg>

Beide Rollen passen in dieselbe Anwendung — nur nicht in dieselbe Schicht. Welcher Baustein den fremden Aufruf tätigt, ist keine Nebensächlichkeit, dazu weiter unten mehr.

## Die Beispiel-API: JSONPlaceholder

Für die Beispiele in diesem Infoblatt wird [JSONPlaceholder](https://jsonplaceholder.typicode.com) angefragt — ein kostenloser Testdienst ohne Anmeldung, extra für Übungszwecke gebaut. Er tut so, als wäre er das Backend eines Blogs, und liefert dafür erfundene Daten.

| Endpunkt | Liefert |
|---|---|
| `GET /posts` | alle Blogbeiträge als Liste |
| `GET /posts/{id}` | einen einzelnen Blogbeitrag |

Ein einzelner Beitrag sieht so aus:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit suscipit recusandae consequuntur expedita et cum ..."
}
```

Im Folgenden siehst du beides: wie ein einzelner Beitrag abgerufen und an ein DTO gebunden wird — und, kurz, wie aus derselben API eine ganze Liste wird.

## Das Werkzeug: `RestClient`

Spring bringt für ausgehende HTTP-Aufrufe eine eigene Klasse mit: `RestClient`. Ihre Aufrufe reihen sich aneinander (**Method-Chaining**, auch *Fluent API* genannt) — jeder Aufruf gibt ein Objekt zurück, an dem der nächste direkt andockt.

```java
import org.springframework.web.client.RestClient;

RestClient client = RestClient.create();

PostDto antwort = client.get()
        .uri("https://jsonplaceholder.typicode.com/posts/{id}", id)
        .retrieve()
        .body(PostDto.class);
```

`RestClient.create()` statt `new RestClient()`: `RestClient` ist ein **Interface**, keine Klasse — `new RestClient()` würde gar nicht kompilieren. `create()` ist eine statische Fabrikmethode, die eine fertig eingerichtete Standard-Implementierung liefert. Für mehr Kontrolle (Basis-URL, Timeouts, Interceptors) gibt es `RestClient.builder()`.

Vier Schritte, jeder für sich benannt:

1. **`get()`** — die HTTP-Methode. Genauso gibt es `post()`, `put()`, `delete()`.
2. **`uri(...)`** — die Adresse. Die geschweiften Klammern sind Platzhalter; die Werte dahinter werden der Reihe nach eingesetzt und dabei automatisch URL-kodiert.
3. **`retrieve()`** — löst den Aufruf tatsächlich aus.
4. **`body(PostDto.class)`** — liest den Antwortkörper und wandelt ihn in ein Objekt um. Dieselbe Jackson-Bibliothek, die auch `@RequestBody` bedient, arbeitet hier nur in die andere Richtung.

Für eine ganze Liste ändert sich nur die Adresse und die Bindung:

```java
List<PostDto> posts = client.get()
        .uri("https://jsonplaceholder.typicode.com/posts")
        .retrieve()
        .body(new ParameterizedTypeReference<List<PostDto>>() {});
```

`body(List.class)` würde hier nicht reichen — Java löscht zur Laufzeit, welche Art Liste gemeint ist (**Type Erasure**). `ParameterizedTypeReference` trägt den vollen Typ `List<PostDto>` noch zur Laufzeit in sich.

:::note Was ist mit `RestTemplate`?
`RestTemplate` ist die ältere Klasse für denselben Zweck — in vielen Anleitungen und älteren Projekten steht sie noch. Sie funktioniert nach demselben Grundprinzip, nur mit einer Methode je Kombination aus HTTP-Verb und Rückgabeart (`getForObject`, `postForEntity`, …) statt der fließenden Schreibweise oben. Seit Spring 6.1 ist `RestClient` der empfohlene Nachfolger und der einzige, den Spring Boot ab Version 4 noch selbst mit einer fertigen Builder-Bean unterstützt.
:::

## Was in der Antwort ankommt — und was davon zählt

Eine fremde API antwortet selten genau mit dem, was du brauchst. Von den vier Feldern eines Beitrags (siehe oben) werden vielleicht nur `id` und `title` gebraucht, `userId` und `body` nicht. Trotzdem lohnt es sich nicht, von Hand im JSON zu suchen — dafür gibt es dasselbe Werkzeug, das du schon für eingehende Anfragen kennst: ein DTO, an das Jackson die Antwort bindet.

```java
@JsonIgnoreProperties(ignoreUnknown = true)
public record PostDto(Long id, String title) {
}
```

`@JsonIgnoreProperties(ignoreUnknown = true)` ist hier wichtiger als bei einem selbst entworfenen DTO: Du bestimmst nicht, was die fremde API liefert, und du willst nicht, dass dein Programm abstürzt, nur weil dort morgen ein zusätzliches Feld auftaucht. Ohne diese Annotation wirft Jackson bei jedem unbekannten Feld eine Ausnahme — auch bei einem, das dich gar nicht interessiert, wie hier `userId` und `body`.

:::tip Nicht nur fehlende Felder ignorieren — auch überzählige
Das DTO oben lässt `userId` und `body` einfach weg. Das ist kein Sonderfall, sondern der Normalfall: Ein DTO für eine fremde Antwort bildet nur ab, was die eigene Anwendung tatsächlich braucht, nicht die vollständige Struktur der Gegenseite.
:::

## Wenn die fremde API einen Fehler meldet

Ein Aufruf kann scheitern — der Server ist nicht erreichbar, oder er meldet selbst einen Fehler, etwa weil ein Parameter ungültig war. `RestClient` behandelt jede Antwort ab Statuscode 400 standardmäßig als Ausnahme:

```java
try {
    PostDto post = client.get()
            .uri(url, id)
            .retrieve()
            .body(PostDto.class);
} catch (HttpClientErrorException.NotFound e) {
    throw new PostNotFoundException(id);
}
```

`HttpClientErrorException` ist die allgemeine Ausnahme für 4xx-Antworten; für jeden Statuscode gibt es eine eigene Unterklasse — `NotFound` für 404, `UnprocessableContent` für 422, und so weiter. Welche davon zu fangen ist, verrät nur ein Blick in die Dokumentation der fremden API oder ein eigener Testaufruf mit einer absichtlich falschen Kennung. Wichtig ist, was danach passiert: Die Ausnahme der fremden Bibliothek verlässt diese Methode nicht. Stattdessen entsteht eine **eigene** fachliche Ausnahme — genau wie bei `SupplierNotFoundException` in Tutorial 04. Der Rest der Anwendung soll nicht wissen müssen, dass hinter `PostNotFoundException` gerade eine andere Firma mit ihrer eigenen API steckt.

:::warning Eine fremde API ist kein Teil deiner Anwendung — auch wenn es sich so anfühlt
Sie kann langsam sein, ausfallen, ihr Antwortformat ändern oder ihre Nutzungsbedingungen anpassen — ohne dass du davon vorher erfährst. Fange deshalb an der Grenze ab, was du kontrollieren kannst (ungültige Eingaben, erwartbare Fehlerfälle), und mute dem Rest deiner Anwendung keine Kenntnis vom fremden Dienst zu.
:::

## Wo dieser Aufruf hinschreibt

Der Aufruf einer fremden API ist fachliche Arbeit — er beantwortet eine Frage aus dem Anwendungsfall heraus, keine HTTP-Detailfrage. Er gehört deshalb in eine eigene Klasse auf Höhe des Service, nicht in den Controller:

```java
@Service
public class PostService {

    private final RestClient restClient = RestClient.create();

    @Value("${posts.api.url}")
    private String apiUrl;

    public PostDto findById(Long id) {
        // ...
    }
}
```

```properties title="application.properties"
posts.api.url=https://jsonplaceholder.typicode.com/posts
```

`@Value("${posts.api.url}")` holt die Adresse aus der `application.properties`, statt sie im Code fest zu verdrahten. Das hat denselben Grund wie bei der Datenbank-Adresse: Eine Testumgebung oder ein anderer Betreiber der Anwendung braucht womöglich eine andere Adresse, ohne dass dafür Java-Code geändert werden muss.

Ruft der eigentliche fachliche Service diese Klasse auf, bleibt die Regel aus dem Infoblatt [DTOs und Schichten](/infoblaetter/dto-schichten) gewahrt: Der Controller reicht nur weiter, die Fachlichkeit — wozu jetzt auch „eine fremde API befragen" zählt — bleibt im Service.

## Das Wichtigste in Kürze

- Dein Backend ist jetzt **Client und Server zugleich** — je nachdem, welche Verbindung man betrachtet.
- `RestClient` ist das aktuelle Werkzeug für ausgehende Aufrufe; `RestTemplate` ist die ältere, in Spring Boot 4 nicht mehr automatisch unterstützte Alternative.
- Die Antwort einer fremden API wird wie jede JSON-Antwort an ein DTO gebunden — mit `@JsonIgnoreProperties(ignoreUnknown = true)`, weil du das Format nicht selbst bestimmst, und mit nur den Feldern, die tatsächlich gebraucht werden.
- Ein Fehler der fremden API (z. B. `HttpClientErrorException.NotFound`) wird an der Aufrufstelle in eine **eigene** fachliche Ausnahme übersetzt, nicht durchgereicht.
- Der Aufruf gehört in eine eigene Service-Klasse, aufgerufen vom fachlichen Service — nicht in den Controller.

## Weiterlesen

- [DTOs und Schichten](/infoblaetter/dto-schichten) — wo Fachlichkeit hingehört und wo nicht
- [Fehlerantworten](/infoblaetter/fehlerantworten) — wie aus einer Ausnahme eine saubere HTTP-Antwort wird
- [JSON](/infoblaetter/json) — wie Jackson zwischen Java-Objekten und JSON übersetzt
