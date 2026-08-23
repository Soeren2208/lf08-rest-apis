---
title: JPA, Hibernate und die Entität
sidebar_label: JPA und Hibernate
sidebar_position: 6
---

# JPA, Hibernate und die Entität

## Zwei Welten, die nicht zusammenpassen

In Java denkst du in **Objekten**. In einer Datenbank liegen **Tabellen**. Beide speichern Daten — aber nach völlig verschiedenen Regeln.

| | Java-Welt | Datenbank-Welt |
|---|---|---|
| Einheit | Objekt | Zeile in einer Tabelle |
| Beziehung | Referenz (`person.getContact()`) | Fremdschlüssel |
| Sammlung | `List`, `Set` | eigene Tabelle mit Fremdschlüssel |
| Vererbung | gibt es | gibt es **nicht** |
| Identität | Speicheradresse | Primärschlüssel |
| Zugriff | `getFirstname()` | `SELECT firstname FROM ...` |

Sobald Daten dauerhaft gespeichert werden sollen, muss ständig zwischen diesen Welten übersetzt werden. Fachleute nennen den Unterschied den **Impedance Mismatch** — sinngemäß: Die beiden passen nicht bruchlos aufeinander.

## Wie es ohne Hilfsmittel aussieht

Im ersten Lehrjahr hast du das im NHPlus-Projekt selbst geschrieben — eine **DAO**-Klasse mit JDBC:

```java
public Person findById(long id) throws SQLException {
    String sql = "SELECT id, firstname, surname FROM person WHERE id = ?";
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setLong(1, id);
        ResultSet rs = stmt.executeQuery();
        if (rs.next()) {
            Person p = new Person();
            p.setId(rs.getLong("id"));
            p.setFirstname(rs.getString("firstname"));
            p.setSurname(rs.getString("surname"));
            return p;
        }
        return null;
    }
}
```

Diese 15 Zeilen holen **einen** Datensatz. Dazu kämen `save`, `update`, `delete`, `findAll` — und dasselbe noch einmal für jede weitere Klasse.

:::danger Was daran mühsam ist
- **Viel Code, wenig Inhalt.** Der eigentliche Zweck („hole Person mit dieser Id") verschwindet zwischen Boilerplate.
- **Nichts wird geprüft.** Das SQL steht in einer Zeichenkette. Ein Tippfehler in `firstname` fällt erst zur Laufzeit auf.
- **Jede Änderung wirkt an mehreren Stellen.** Ein neues Attribut bedeutet: Klasse ändern, `SELECT` ändern, `INSERT` ändern, `UPDATE` ändern, das Auslesen ändern.
- **Datenbankabhängig.** Der SQL-Dialekt von H2 ist nicht der von PostgreSQL.
:::

## Was ein objektrelationaler Mapper tut

Ein **objektrelationaler Mapper** (kurz **O/R-Mapper** oder **ORM**) übernimmt genau diese Übersetzung. Du sagst, *was* passieren soll — er erzeugt das passende SQL.

<svg viewBox="0 0 720 400" width="100%" role="img"
     aria-label="Hibernate übersetzt zwischen der Objektwelt und der Tabellenwelt"
     fontFamily="var(--ifm-font-family-base)">

  {/* ---- linke Welt: Objekte ---- */}
  <text x="112" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-color-primary)">Welt der Objekte</text>
  <g transform="translate(14,38)">
    <rect width="196" height="196" rx="12" fill="var(--ifm-color-primary)" opacity="0.10"/>
    <rect width="196" height="196" rx="12" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="1.8"/>
    <g transform="translate(24,24)" stroke="var(--ifm-color-primary)" strokeWidth="1.8" fill="none">
      <path d="M0 8 L14 0 L28 8 L28 24 L14 32 L0 24 Z"/>
      <path d="M0 8 L14 16 L28 8 M14 16 L14 32"/>
    </g>
    <text x="66" y="44" fontSize="13.5" fontWeight="700" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">Person</text>
    <text x="24" y="86" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">id = 1</text>
    <text x="24" y="106" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">firstname = "Anna"</text>
    <text x="24" y="126" fontSize="11.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">surname = "Schmidt"</text>
    <text x="24" y="160" fontSize="11" fill="var(--ifm-color-emphasis-700)">Referenzen, Vererbung,</text>
    <text x="24" y="176" fontSize="11" fill="var(--ifm-color-emphasis-700)">Methoden</text>
  </g>

  {/* ---- Hibernate in der Mitte ---- */}
  <g transform="translate(238,38)">
    <rect width="244" height="196" rx="12" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-500)" strokeWidth="2"/>
    <text x="122" y="34" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--ifm-font-color-base)">Hibernate</text>
    <text x="122" y="54" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-700)">der O/R-Mapper — übersetzt</text>

    <rect x="24" y="76" width="196" height="42" rx="8" fill="var(--ifm-background-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="122" y="94" textAnchor="middle" fontSize="11" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">repository.save(person)</text>
    <text x="122" y="110" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">du schreibst das</text>

    <path d="M136 122 L136 136" stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.8"/>
    <path d="M131 130 L136 138 L141 130" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.8"/>

    <rect x="24" y="140" width="196" height="42" rx="8" fill="var(--ifm-background-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="122" y="158" textAnchor="middle" fontSize="10.5" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">insert into person ...</text>
    <text x="122" y="174" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">Hibernate erzeugt das</text>
  </g>

  {/* Pfeile zwischen den Welten */}
  <path d="M214 118 L232 118" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M225 113 L234 118 L225 123" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M488 118 L506 118" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M499 113 L508 118 L499 123" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>

  {/* ---- rechte Welt: Tabelle ---- */}
  <text x="608" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ifm-color-emphasis-700)">Welt der Tabellen</text>
  <g transform="translate(510,38)">
    <rect width="196" height="196" rx="12" fill="var(--ifm-color-emphasis-200)" opacity="0.5"/>
    <rect width="196" height="196" rx="12" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.8"/>
    <text x="98" y="30" textAnchor="middle" fontSize="12.5" fontWeight="700" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">PERSON</text>

    <rect x="18" y="44" width="160" height="26" fill="var(--ifm-color-emphasis-300)"/>
    <rect x="18" y="70" width="160" height="26" fill="var(--ifm-background-color)"/>
    <rect x="18" y="96" width="160" height="26" fill="var(--ifm-background-color)"/>
    <path d="M18 44 L178 44 L178 122 L18 122 Z M18 70 L178 70 M18 96 L178 96 M50 44 L50 122 M114 44 L114 122"
          fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.2"/>
    <text x="26" y="61" fontSize="9" fontWeight="700" fill="var(--ifm-color-emphasis-800)">ID</text>
    <text x="57" y="61" fontSize="9" fontWeight="700" fill="var(--ifm-color-emphasis-800)">FIRSTNAME</text>
    <text x="121" y="61" fontSize="9" fontWeight="700" fill="var(--ifm-color-emphasis-800)">SURNAME</text>
    <text x="26" y="87" fontSize="10" fill="var(--ifm-color-emphasis-800)">1</text>
    <text x="58" y="87" fontSize="10" fill="var(--ifm-color-emphasis-800)">Anna</text>
    <text x="122" y="87" fontSize="10" fill="var(--ifm-color-emphasis-800)">Schmidt</text>
    <text x="26" y="113" fontSize="10" fill="var(--ifm-color-emphasis-800)">2</text>
    <text x="58" y="113" fontSize="10" fill="var(--ifm-color-emphasis-800)">Ben</text>
    <text x="122" y="113" fontSize="10" fill="var(--ifm-color-emphasis-800)">Kaya</text>

    <text x="18" y="150" fontSize="11" fill="var(--ifm-color-emphasis-700)">Fremdschlüssel, Zeilen,</text>
    <text x="18" y="166" fontSize="11" fill="var(--ifm-color-emphasis-700)">keine Vererbung</text>
  </g>

  {/* Rueckweg */}
  <path d="M600 246 C600 286 360 286 360 246" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2" strokeDasharray="6 4"/>
  <path d="M355 254 L360 244 L365 254" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <path d="M232 246 C232 286 120 286 120 246" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2" strokeDasharray="6 4"/>
  <path d="M115 254 L120 244 L125 254" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
  <text x="360" y="304" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-primary)">und denselben Weg zurück: aus Zeilen werden wieder Objekte</text>

  {/* Fazit */}
  <rect x="14" y="326" width="692" height="60" rx="10" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-300)"/>
  <text x="360" y="350" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Du schreibst nur die linke Seite — das SQL entsteht von selbst</text>
  <text x="360" y="372" textAnchor="middle" fontSize="11.5" fill="var(--ifm-color-emphasis-700)">Mit spring.jpa.show-sql=true kannst du im Log mitlesen, was Hibernate daraus macht</text>
</svg>

Der O/R-Mapper in deinem Projekt heißt **Hibernate**. Er ist der verbreitetste der Java-Welt.

### Das kannst du selbst beobachten

In deiner `application.properties` steht:

```properties
spring.jpa.show-sql=true
```

Damit schreibt Hibernate jedes erzeugte SQL ins Log. Diese Anweisungen hat er in deinem Projekt tatsächlich erzeugt — ohne dass du eine Zeile SQL geschrieben hättest:

**Beim Start**, aus der Klasse `Person`:

```sql
create sequence person_seq start with 1 increment by 50

create table person (
    id bigint not null,
    firstname varchar(255),
    surname varchar(255),
    primary key (id)
)
```

**Bei `repository.save(person)`** für eine neue Person:

```sql
insert into person (firstname, surname, id) values (?, ?, ?)
```

**Bei `repository.findById(1L)`**:

```sql
select p1_0.id, p1_0.firstname, p1_0.surname
from person p1_0
where p1_0.id = ?
```

**Bei `repository.save(person)`** für eine **vorhandene** Person:

```sql
update person set firstname=?, surname=? where id=?
```

:::tip Beachte den Unterschied
Zweimal derselbe Aufruf `save()` — einmal wird daraus ein `INSERT`, einmal ein `UPDATE`. Entschieden wird das anhand der `id`: Ist sie noch leer, gilt das Objekt als neu. (Genau genommen trifft diese Entscheidung Spring Data JPA, das je nachdem `persist` oder `merge` aufruft; Hibernate führt sie aus.)

Das hat eine Kehrseite: Schickt ein Client eine `id` mit, die es schon gibt, wird aus einem vermeintlichen Anlegen ein Überschreiben. Mehr dazu in Tutorial 1, Arbeitsblatt 3, Testfall TF-10.

Genau solche Entscheidungen nimmt dir ein O/R-Mapper ab.
:::

## Drei Namen, die man ständig verwechselt

In deinem Projekt tauchen drei Bezeichnungen auf, die scheinbar dasselbe meinen. Sie meinen aber **drei verschiedene Ebenen**:

<svg viewBox="0 0 720 400" width="100%" role="img"
     aria-label="Drei Ebenen: Spring Data JPA, die Spezifikation JPA und die Implementierung Hibernate"
     fontFamily="var(--ifm-font-family-base)">

  <text x="16" y="22" fontSize="12.5" fontWeight="700" fill="var(--ifm-color-emphasis-700)">Dein Code steht ganz oben</text>

  {/* Ebene 1 */}
  <g transform="translate(14,34)">
    <rect width="692" height="80" rx="11" fill="var(--ifm-color-primary)" opacity="0.14"/>
    <rect width="692" height="80" rx="11" fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2"/>
    <text x="24" y="32" fontSize="15" fontWeight="700" fill="var(--ifm-font-color-base)">Spring Data JPA</text>
    <text x="24" y="54" fontSize="12" fill="var(--ifm-color-emphasis-800)">Der Komfort obendrauf — erzeugt aus deinem Interface ein fertiges Repository</text>
    <text x="24" y="70" fontSize="11" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-primary)">interface PersonRepository extends JpaRepository</text>
    <rect x="560" y="20" width="108" height="42" rx="8" fill="var(--ifm-background-color)" stroke="var(--ifm-color-primary)"/>
    <text x="614" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ifm-color-primary)">von Spring</text>
    <text x="614" y="53" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">bequem</text>
  </g>
  <path d="M360 118 L360 134" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M355 128 L360 137 L365 128" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>

  {/* Ebene 2 */}
  <g transform="translate(14,140)">
    <rect width="692" height="80" rx="11" fill="var(--ifm-background-color)" stroke="var(--ifm-color-emphasis-500)" strokeWidth="2" strokeDasharray="7 5"/>
    <text x="24" y="32" fontSize="15" fontWeight="700" fill="var(--ifm-font-color-base)">JPA — Jakarta Persistence API</text>
    <text x="24" y="54" fontSize="12" fill="var(--ifm-color-emphasis-800)">Die Spezifikation. Legt fest, was Annotationen bedeuten — führt selbst nichts aus.</text>
    <text x="24" y="70" fontSize="11" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">@Entity  @Id  @GeneratedValue</text>
    <rect x="560" y="20" width="108" height="42" rx="8" fill="var(--ifm-color-emphasis-100)" stroke="var(--ifm-color-emphasis-500)"/>
    <text x="614" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ifm-color-emphasis-800)">nur Regeln</text>
    <text x="614" y="53" textAnchor="middle" fontSize="10.5" fill="var(--ifm-color-emphasis-700)">kein Code</text>
  </g>
  <path d="M360 224 L360 240" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M355 234 L360 243 L365 234" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>

  {/* Ebene 3 */}
  <g transform="translate(14,246)">
    <rect width="692" height="80" rx="11" fill="var(--ifm-color-emphasis-200)" opacity="0.6"/>
    <rect width="692" height="80" rx="11" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
    <text x="24" y="32" fontSize="15" fontWeight="700" fill="var(--ifm-font-color-base)">Hibernate</text>
    <text x="24" y="54" fontSize="12" fill="var(--ifm-color-emphasis-800)">Die Implementierung. Hält sich an die Regeln, erzeugt das SQL und redet mit der Datenbank.</text>
    <text x="24" y="70" fontSize="11" fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-700)">insert into person (firstname, surname, id) values (?, ?, ?)</text>
    <rect x="560" y="20" width="108" height="42" rx="8" fill="var(--ifm-background-color)" stroke="var(--ifm-color-emphasis-600)"/>
    <text x="614" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ifm-color-emphasis-800)">macht die</text>
    <text x="614" y="53" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ifm-color-emphasis-800)">Arbeit</text>
  </g>
  <path d="M360 330 L360 346" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <path d="M355 340 L360 349 L365 340" fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>

  {/* Datenbank */}
  <g transform="translate(298,352)">
    <path d="M0 8 C0 3 27 0 62 0 C97 0 124 3 124 8 L124 38 C124 43 97 46 62 46 C27 46 0 43 0 38 Z"
          fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.6"/>
    <path d="M0 8 C0 13 27 16 62 16 C97 16 124 13 124 8" fill="none" stroke="var(--ifm-color-emphasis-500)" strokeWidth="1.6"/>
    <text x="62" y="36" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="var(--ifm-font-color-base)">Datenbank</text>
  </g>
</svg>

| Name | Was es ist | Woher kommt es |
|---|---|---|
| **JPA** | Eine **Spezifikation** — ein Regelwerk. Definiert `@Entity`, `@Id` und was sie bedeuten sollen. Führt selbst nichts aus. | Jakarta-EE-Standard |
| **Hibernate** | Eine **Implementierung** dieser Regeln. Macht die eigentliche Arbeit. | eigenes Projekt, seit 2001 |
| **Spring Data JPA** | Eine **Bequemlichkeitsschicht** darüber. Erzeugt aus deinem Interface `PersonRepository` eine fertige Klasse. | Spring |

:::info Eine Analogie
**JPA** ist wie die Straßenverkehrsordnung: Sie sagt, was gilt — fährt aber kein Auto.
**Hibernate** ist das Auto, das sich daran hält.
**Spring Data JPA** ist der Fahrdienst, den du anrufst, statt selbst zu fahren.

Deshalb kann man Hibernate theoretisch gegen einen anderen O/R-Mapper austauschen, ohne die Annotationen im Code zu ändern — sie stammen ja aus JPA, nicht aus Hibernate. Du erkennst das an den Import-Zeilen: `jakarta.persistence.Entity`, nicht `org.hibernate...`.
:::

## Die Entität

Eine **Entität** ist eine Java-Klasse, die auf eine Datenbanktabelle abgebildet wird. Aus einer gewöhnlichen Klasse wird sie durch Annotationen.

```java
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String firstname;
    private String surname;

    public Person() { }
    // Getter und Setter
}
```

### Die Abbildungsregeln

| Im Code | In der Datenbank |
|---|---|
| Klasse `Person` | Tabelle `person` |
| Attribut `firstname` | Spalte `firstname` |
| Attribut mit `@Id` | Primärschlüssel |
| `Long` | `bigint` |
| `String` | `varchar(255)` |

Hibernate leitet die Namen automatisch ab. Aus `PersonAddress` würde die Tabelle `person_address` — Großbuchstaben werden zu Unterstrichen.

:::tip Abweichende Namen
Soll die Tabelle anders heißen als die Klasse, gibt man es an:

```java
@Entity
@Table(name = "supplier_contact")
public class ContactEntity { ... }
```

Analog `@Column(name = "zip")` für eine einzelne Spalte. Das braucht man vor allem bei **bestehenden** Datenbanken, deren Namen man nicht ändern darf.
:::

### Der Primärschlüssel

`@GeneratedValue` bedeutet: Den Wert vergibt die Datenbank, nicht dein Programm.

| Strategie | Verfahren |
|---|---|
| `AUTO` | Hibernate wählt selbst — bei den meisten Datenbanken eine Sequenz |
| `IDENTITY` | Die Datenbank zählt pro Tabelle hoch (`AUTO_INCREMENT`) |
| `SEQUENCE` | Ein eigenes Datenbankobjekt liefert die nächste freie Zahl |

In deinem Projekt steht `AUTO`. Das Log verrät, wofür Hibernate sich entschieden hat:

```sql
create sequence person_seq start with 1 increment by 50
```

Also eine **eigene Sequenz für diese Entität**, mit dem Namen `person_seq`.

:::warning Das `increment by 50` überrascht viele
Hibernate holt sich nicht jede Id einzeln, sondern reserviert **50 auf einmal**. Das spart Datenbankzugriffe, wenn viele Datensätze angelegt werden.

Die Folge: Nach einem Neustart kann die nächste Id einen Sprung machen — etwa von 3 auf 51. Das ist **kein Fehler**. Primärschlüssel müssen eindeutig sein, nicht lückenlos.
:::

### Warum der parameterlose Konstruktor bleiben muss

Hibernate baut Objekte in zwei Schritten: erst ein leeres Objekt erzeugen, dann die Werte aus der Datenbank hineinschreiben. Für den ersten Schritt braucht es einen Konstruktor ohne Parameter.

Fehlt er, scheitert der Start mit einer schwer lesbaren Meldung.

:::danger Deshalb kann eine Entität kein Record sein
Ein Record wäre für eine Datenklasse verlockend — er spart Konstruktor, Getter und `equals()`. Für eine Entität geht es aber nicht, aus drei Gründen:

1. Ein Record hat **nur** den Konstruktor mit allen Werten, keinen parameterlosen.
2. Seine Felder sind `final`. Hibernate muss aber nach dem `INSERT` die erzeugte `id` **nachträglich** hineinschreiben.
3. Ein Record ist `final` und kann nicht abgeleitet werden. Hibernate braucht aber Unterklassen, um Beziehungen erst bei Bedarf nachzuladen.

**Merke:** Records eignen sich für Daten, die sich nicht mehr ändern — also für Antwortobjekte. Entitäten spiegeln einen Zustand, der sich ändert, und bleiben deshalb gewöhnliche Klassen.
:::

## Wer erzeugt eigentlich die Tabelle?

Auch das steuert eine Einstellung:

```properties
spring.jpa.hibernate.ddl-auto=create-drop
```

| Wert | Verhalten |
|---|---|
| `none` | Hibernate fasst das Schema nicht an |
| `validate` | prüft nur, ob Tabellen zu den Entitäten passen |
| `update` | ergänzt Fehlendes, löscht aber nie etwas |
| `create` | legt beim Start alles neu an — vorhandene Daten sind weg |
| `create-drop` | wie `create`, räumt beim Beenden zusätzlich auf |

Bei einer In-Memory-Datenbank ist das unkritisch: Sie ist beim Start ohnehin leer.

:::danger Niemals im Produktivbetrieb
`create` und `create-drop` löschen Daten. `update` kann keine Spalten umbenennen und keine Daten umziehen.

In echten Projekten verwaltet man das Schema deshalb mit Werkzeugen wie **Flyway** oder **Liquibase**, die jede Änderung als versioniertes SQL-Skript festhalten — nachvollziehbar und wiederholbar.
:::

## Was ein O/R-Mapper *nicht* löst

Damit du weißt, was noch kommt:

- **Er nimmt dir SQL nicht dauerhaft ab.** Bei komplexen Auswertungen schreibt man weiterhin Abfragen — dann in JPQL oder direkt in SQL.
- **Bequemlichkeit kann teuer werden.** Wer über eine Liste von Lieferanten läuft und zu jedem die Artikel abruft, erzeugt womöglich hunderte Einzelabfragen. Dieses Muster heißt **N+1-Problem**.
- **Man muss entscheiden, wann verbundene Objekte geladen werden** — sofort oder erst bei Bedarf (*Eager* und *Lazy Loading*).

Beides begegnet dir, sobald Entitäten Beziehungen zueinander haben. In diesem Tutorial gibt es nur eine einzige Klasse — deshalb bleibt es hier einfach.

:::note Das hast du gelernt
- Objekte und Tabellen folgen verschiedenen Regeln; die Übersetzung dazwischen heißt **objektrelationales Mapping**.
- Ein **O/R-Mapper** wie **Hibernate** erzeugt das SQL für dich — sichtbar über `spring.jpa.show-sql=true`.
- **JPA** ist die Spezifikation, **Hibernate** die Implementierung, **Spring Data JPA** der Komfort darüber.
- `@Entity` macht eine Klasse dauerhaft speicherbar und bildet sie auf eine Tabelle ab; ob diese Tabelle auch **angelegt** wird, entscheidet `ddl-auto`. `@Id` kennzeichnet den Primärschlüssel, `@GeneratedValue` überlässt dessen Vergabe der Datenbank.
- Der **parameterlose Konstruktor** ist Pflicht — deshalb kann eine Entität **kein Record** sein.
- `ddl-auto` steuert, wer das Schema anlegt. Für den Produktivbetrieb nimmt man Flyway oder Liquibase.
:::
