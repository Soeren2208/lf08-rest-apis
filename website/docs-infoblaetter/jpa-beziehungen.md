---
title: Beziehungen mit JPA abbilden
sidebar_label: Beziehungen (1:1, 1:n, n:m)
sidebar_position: 9
---

# Beziehungen mit JPA abbilden

Das Infoblatt [JPA und Hibernate](/infoblaetter/jpa-hibernate) erklärt, wie **eine** Klasse zu **einer** Tabelle wird. Hier geht es um den Schritt danach: Wie werden aus Verweisen zwischen Objekten Fremdschlüssel zwischen Tabellen?

Die Beispiele stammen bewusst **nicht** aus dem [Webshop-Tutorial](/tutorial-04/) — dort siehst du sie in Aktion, hier zum Nachschlagen an anderen Fällen.

## Die Grundfrage

In der Objektwelt zeigt ein Objekt auf ein anderes, indem es es **festhält**. In der Datenbank gibt es kein Festhalten — dort steht in einer Spalte die **Nummer** der anderen Zeile.

<svg viewBox="0 0 720 210" width="100%" role="img"
     aria-label="In der Objektwelt hält ein Objekt eine Referenz auf ein anderes, in der Datenbank steht in einer Spalte der Schlüssel der anderen Zeile"
     fontFamily="var(--ifm-font-family-base)">

  <text x="176" y="20" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Objektwelt</text>

  <rect x="24" y="34" width="130" height="62" rx="8"
        fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
  <text x="89" y="56" textAnchor="middle" fontSize="12.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">Student</text>
  <text x="89" y="78" textAnchor="middle" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">id = 7</text>

  <path d="M158 65 L214 65" stroke="var(--ifm-color-emphasis-600)" strokeWidth="2"/>
  <polygon points="222,65 210,59 210,71" fill="var(--ifm-color-emphasis-600)"/>
  <text x="190" y="55" textAnchor="middle" fontSize="10.5"
        fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">mainCourse</text>

  <rect x="226" y="34" width="106" height="62" rx="8"
        fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
  <text x="279" y="56" textAnchor="middle" fontSize="12.5" fontWeight="700"
        fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">Course</text>
  <text x="279" y="78" textAnchor="middle" fontSize="11"
        fill="var(--ifm-color-emphasis-800)">id = 3</text>

  <text x="176" y="126" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Das Objekt hält das andere fest.</text>
  <text x="176" y="144" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Man kommt mit einem Punkt hin:</text>
  <text x="176" y="164" textAnchor="middle" fontSize="11.5"
        fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">student.getMainCourse()</text>

  <line x1="360" y1="26" x2="360" y2="184" stroke="var(--ifm-color-emphasis-400)" strokeDasharray="4 4"/>

  <text x="544" y="20" textAnchor="middle" fontSize="14" fontWeight="700"
        fill="var(--ifm-font-color-base)">Datenbank</text>

  <g>
    <rect x="392" y="34" width="150" height="24" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="404" y="51" fontSize="11" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">student</text>
    <rect x="392" y="58" width="75" height="24" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <rect x="467" y="58" width="75" height="24" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="429" y="75" textAnchor="middle" fontSize="10.5"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">id</text>
    <text x="504" y="75" textAnchor="middle" fontSize="10.5"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">main_course_id</text>
    <rect x="392" y="82" width="75" height="24" fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <rect x="467" y="82" width="75" height="24" fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="429" y="99" textAnchor="middle" fontSize="11"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">7</text>
    <text x="504" y="99" textAnchor="middle" fontSize="11" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">3</text>
  </g>

  <g>
    <rect x="578" y="34" width="118" height="24" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="590" y="51" fontSize="11" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">course</text>
    <rect x="578" y="58" width="118" height="24" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="637" y="75" textAnchor="middle" fontSize="10.5"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">id</text>
    <rect x="578" y="82" width="118" height="24" fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="637" y="99" textAnchor="middle" fontSize="11" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">3</text>
  </g>

  <path d="M542 94 L570 94" stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.5" strokeDasharray="3 2"/>

  <text x="544" y="126" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Die Spalte enthält eine Zahl.</text>
  <text x="544" y="144" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">Man kommt nur mit einem JOIN hin —</text>
  <text x="544" y="162" textAnchor="middle" fontSize="11.5"
        fill="var(--ifm-color-emphasis-800)">oder mit einer zweiten Abfrage.</text>

  <text x="360" y="200" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Die Annotation ist die Übersetzungsvorschrift zwischen beiden Bildern.</text>
</svg>

## Der eine Begriff, ohne den nichts davon Sinn ergibt: die Besitzerseite

Bei einer **zweiseitigen** (bidirektionalen) Beziehung zeigen beide Klassen aufeinander. In der Datenbank gibt es aber nur **eine** Spalte mit dem Fremdschlüssel. JPA muss also wissen, welche der beiden Seiten diese Spalte beschreibt.

Diese Seite heißt **Besitzerseite** (*owning side*). Die andere ist die **inverse Seite** und wird mit `mappedBy` gekennzeichnet.

| | Besitzerseite | inverse Seite |
|---|---|---|
| Woran erkennbar | hat `@JoinColumn` oder gar nichts | hat **`mappedBy`** |
| Wo liegt der Fremdschlüssel | **hier** | nirgends — sie ist nur die Rückrichtung |
| Was beim Speichern zählt | **nur diese Seite** | wird beim Schreiben **ignoriert** |
| Bei 1:n / n:1 immer | die `@ManyToOne`-Seite | die `@OneToMany`-Seite |

:::danger Die Fehlvorstellung, die am meisten Zeit kostet
„Ich habe die Liste beim Kurs gefüllt, also ist der Student jetzt in diesem Kurs."

**Nein.** Wenn du nur die inverse Seite füllst, schreibt JPA gar nichts. Nach dem nächsten Neustart ist die Zuordnung weg — ohne Fehlermeldung.

```java
// Falsch: nur die inverse Seite gesetzt
course.getStudents().add(student);
courseRepository.save(course);          // schreibt die Zuordnung NICHT

// Richtig: die Besitzerseite setzen
student.setMainCourse(course);
studentRepository.save(student);        // schreibt die Spalte main_course_id
```

Der Grund ist der obige: `main_course_id` steht in der Tabelle `student`. Wer den Kurs speichert, fasst diese Spalte nicht an.

**Merksatz:** Der Fremdschlüssel liegt immer auf der Seite, die *viele* sein kann.
:::

Weil beide Seiten trotzdem im Arbeitsspeicher zusammenpassen sollen, schreibt man bei bidirektionalen Beziehungen eine kleine Hilfsmethode:

```java
// in Course
public void addStudent(Student student) {
    students.add(student);           // damit die Liste im Speicher stimmt
    student.setMainCourse(this);     // damit die Datenbank es erfährt
}
```

## 1:1 — genau eines auf jeder Seite

**Beispiel:** Ein Mitarbeiter hat genau einen Werksausweis, und ein Werksausweis gehört zu genau einem Mitarbeiter.

```java title="unidirektional — der Normalfall"
@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne
    @JoinColumn(name = "badge_id")
    private Badge badge;
}
```

Daraus entsteht in der Tabelle `employee` eine Spalte `badge_id` — mit **UNIQUE**-Bedingung. Genau die macht aus einer 1:n eine 1:1: Kein zweiter Mitarbeiter kann denselben Ausweis eintragen.

```sql
-- so sieht es in der Datenbank aus
employee ( id, name, badge_id )
   badge_id → badge(id),  UNIQUE (badge_id)
```

:::note Nachgemessen
Lässt man `@JoinColumn` weg, macht Hibernate dasselbe und nennt die Spalte nach dem Feld — `badge_id`, samt UNIQUE-Bedingung. Die Annotation ist also nur nötig, wenn der Name anders lauten soll.
:::

### Die Varianten

| Variante | Wie | Wann |
|---|---|---|
| **unidirektional** | nur `Employee` kennt `Badge` | Der Normalfall. Nimm ihn, solange du die Rückrichtung nicht brauchst |
| **bidirektional** | `Badge` bekommt zusätzlich `@OneToOne(mappedBy = "badge") private Employee employee;` | Wenn du vom Ausweis zum Mitarbeiter navigieren musst |
| **gemeinsamer Schlüssel** | `@MapsId` — der Ausweis bekommt **dieselbe** Id wie der Mitarbeiter | Spart eine Spalte und garantiert die 1:1 auf Datenbankebene. Fortgeschritten |

:::warning 1:1 ist seltener, als man denkt
Bevor du eine 1:1-Beziehung baust, prüfe: Warum sind das zwei Tabellen und nicht eine? Gute Gründe gibt es — sehr große Felder auslagern, unterschiedliche Zugriffsrechte, ein Teil ist optional. Wenn keiner davon zutrifft, gehören die Felder wahrscheinlich in **eine** Klasse.
:::

## 1:n und n:1 — dieselbe Beziehung von zwei Seiten

**Beispiel:** Ein Kurs hat viele Lektionen, jede Lektion gehört zu genau einem Kurs.

`1:n` und `n:1` sind **keine zwei Beziehungen**, sondern zwei Blickrichtungen auf dieselbe. Der Fremdschlüssel liegt bei der `n`-Seite — bei der Lektion.

```java title="die Besitzerseite: hier liegt der Fremdschlüssel"
@Entity
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
```

```java title="die inverse Seite: nur die Rückrichtung"
@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @OneToMany(mappedBy = "course")
    private List<Lesson> lessons = new ArrayList<>();
}
```

Das `mappedBy = "course"` zeigt auf den **Feldnamen in `Lesson`** — nicht auf eine Spalte und nicht auf die Klasse. Ein Tippfehler dort ist ein Startfehler, kein Laufzeitfehler; die Anwendung fährt gar nicht erst hoch.

### Die Varianten

| Variante | Wie es aussieht | Was in der Datenbank entsteht |
|---|---|---|
| **n:1 unidirektional** | nur `Lesson.course` | Spalte `course_id` in `lesson`. Schlank und meist genug |
| **bidirektional** | zusätzlich `Course.lessons` mit `mappedBy` | dasselbe — die Liste kostet keine Spalte |
| **1:n unidirektional mit `@JoinColumn`** | nur `Course.lessons`, dazu `@JoinColumn(name = "course_id")` | Spalte `course_id` in `lesson`, aber Hibernate füllt sie mit einem zusätzlichen `UPDATE` |
| **1:n unidirektional ohne `@JoinColumn`** | nur `Course.lessons` | ⚠️ **eine Zwischentabelle** — fast nie gewollt |

:::danger Die stille Falle: 1:n ohne `@JoinColumn`
Schreibt man nur die Liste und lässt `@JoinColumn` weg, legt Hibernate eine **Zwischentabelle** an — dieselbe Bauform wie bei n:m.

Nachgemessen an einem Wegwerf-Beispiel mit `@OneToMany List<Lesson> lessons;` ohne weitere Angabe:

```sql
course_lessons ( course_id, lessons_id )
   UNIQUE (lessons_id)
```

Es funktioniert — aber es sind drei Tabellen statt zwei, jede Zuordnung kostet einen zusätzlichen Schreibvorgang, und im Datenmodell steht etwas anderes, als du gemeint hast.

**Die Abhilfe ist immer dieselbe:** Mach die `@ManyToOne`-Seite zur Besitzerseite. Das ist der Weg, den auch das [Webshop-Tutorial](/tutorial-04/02-die-zweite-beziehung) geht.
:::

## n:m — viele auf beiden Seiten

**Beispiel:** Ein Studierender belegt mehrere Kurse, ein Kurs hat mehrere Studierende.

Für n:m gibt es in der Datenbank keine Spalte, die reicht. Es braucht eine **Zwischentabelle**, die nur aus zwei Fremdschlüsseln besteht.

```java title="Besitzerseite"
@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
            name = "student_course",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new HashSet<>();
}
```

```java title="inverse Seite"
@Entity
public class Course {

    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

Bei n:m ist die Wahl der Besitzerseite **frei** — nimm die, von der aus du üblicherweise arbeitest.

<svg viewBox="0 0 720 200" width="100%" role="img"
     aria-label="Bei n zu m liegt zwischen beiden Tabellen eine Zwischentabelle mit zwei Fremdschlüsseln"
     fontFamily="var(--ifm-font-family-base)">

  <g>
    <rect x="30" y="50" width="150" height="26" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="42" y="68" fontSize="11.5" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">student</text>
    <rect x="30" y="76" width="150" height="26" fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="105" y="94" textAnchor="middle" fontSize="11"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">id, name</text>
  </g>

  <g>
    <rect x="270" y="50" width="180" height="26" rx="4" fill="var(--ifm-color-success-contrast-background)"/>
    <rect x="270" y="50" width="180" height="26" rx="4" fill="none" stroke="var(--ifm-color-success-dark)"/>
    <text x="282" y="68" fontSize="11.5" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">student_course</text>
    <rect x="270" y="76" width="90" height="26" fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <rect x="360" y="76" width="90" height="26" fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="315" y="94" textAnchor="middle" fontSize="10.5"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">student_id</text>
    <text x="405" y="94" textAnchor="middle" fontSize="10.5"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">course_id</text>
  </g>

  <g>
    <rect x="540" y="50" width="150" height="26" rx="4" fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="552" y="68" fontSize="11.5" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">course</text>
    <rect x="540" y="76" width="150" height="26" fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-400)"/>
    <text x="615" y="94" textAnchor="middle" fontSize="11"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">id, title</text>
  </g>

  <path d="M182 89 L262 89" stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.5"/>
  <path d="M458 89 L534 89" stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.5"/>
  <text x="222" y="82" textAnchor="middle" fontSize="11" fill="var(--ifm-color-emphasis-800)">1 : n</text>
  <text x="496" y="82" textAnchor="middle" fontSize="11" fill="var(--ifm-color-emphasis-800)">n : 1</text>

  <text x="360" y="140" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Eine n:m-Beziehung ist in der Datenbank immer zwei 1:n-Beziehungen.</text>
  <text x="360" y="164" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Das ist keine Krücke, sondern die einzige Möglichkeit — genau wie bei der Maklerdatenbank.</text>
</svg>

:::warning Der Unterschied zur 1:n-Falle ist genau ein UNIQUE
Beide Fälle erzeugen eine Zwischentabelle mit zwei Spalten. Nachgemessen:

| | Zwischentabelle | Zusatzbedingung |
|---|---|---|
| `@OneToMany` ohne `@JoinColumn` | `course_lessons (course_id, lessons_id)` | **`UNIQUE (lessons_id)`** |
| `@ManyToMany` | `student_course (student_id, course_id)` | keine |

Das UNIQUE ist die ganze 1:n: Es verbietet, dass dieselbe Lektion zu zwei Kursen gehört. Fehlt es, ist es eine n:m.

Wer die Datenbank lesen kann, sieht die Kardinalität also direkt — an den Bedingungen, nicht an den Spalten.
:::

## Sobald die Verbindung selbst etwas weiß: keine n:m mehr

Das ist die praktisch wichtigste Regel dieses Blatts.

Solange die Zuordnung nur „gehört zusammen" bedeutet, reicht `@ManyToMany`. Sobald sie **eigene Angaben** trägt — wann eingeschrieben, welche Note, wie viele Stück, welcher Preis —, hat die Zwischentabelle Spalten, die keinem der beiden Partner gehören. Dann ist sie keine Zwischentabelle mehr, sondern eine **eigene Entität**.

<svg viewBox="0 0 720 230" width="100%" role="img"
     aria-label="Aus einer n zu m Beziehung mit Zusatzangaben werden zwei 1 zu n Beziehungen auf eine eigene Verbindungsklasse"
     fontFamily="var(--ifm-font-family-base)">

  <text x="360" y="20" textAnchor="middle" fontSize="13" fontWeight="700"
        fill="var(--ifm-font-color-base)">„Wann hat sich wer eingeschrieben, und mit welcher Note?"</text>

  <g>
    <rect x="40" y="70" width="140" height="52" rx="8"
          fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
    <text x="110" y="102" textAnchor="middle" fontSize="13" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">Student</text>
  </g>

  <g>
    <rect x="270" y="56" width="180" height="80" rx="8"
          fill="var(--ifm-color-success-contrast-background)"/>
    <rect x="270" y="56" width="180" height="80" rx="8" fill="none"
          stroke="var(--ifm-color-success-dark)" strokeWidth="1.5"/>
    <text x="360" y="80" textAnchor="middle" fontSize="13" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">Enrollment</text>
    <text x="360" y="102" textAnchor="middle" fontSize="11"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">enrolledOn</text>
    <text x="360" y="122" textAnchor="middle" fontSize="11"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-color-emphasis-800)">grade</text>
  </g>

  <g>
    <rect x="540" y="70" width="140" height="52" rx="8"
          fill="var(--ifm-color-emphasis-200)" stroke="var(--ifm-color-emphasis-500)"/>
    <text x="610" y="102" textAnchor="middle" fontSize="13" fontWeight="700"
          fontFamily="var(--ifm-font-family-monospace)" fill="var(--ifm-font-color-base)">Course</text>
  </g>

  <line x1="182" y1="96" x2="268" y2="96" stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.6"/>
  <text x="196" y="88" fontSize="11" fill="var(--ifm-color-emphasis-800)">1</text>
  <text x="250" y="88" fontSize="11" fill="var(--ifm-color-emphasis-800)">0..*</text>

  <line x1="452" y1="96" x2="538" y2="96" stroke="var(--ifm-color-emphasis-600)" strokeWidth="1.6"/>
  <text x="462" y="88" fontSize="11" fill="var(--ifm-color-emphasis-800)">0..*</text>
  <text x="524" y="88" fontSize="11" fill="var(--ifm-color-emphasis-800)">1</text>

  <text x="360" y="176" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Aus einer n:m werden zwei 1:n — und die Verbindung bekommt einen Namen.</text>
  <text x="360" y="202" textAnchor="middle" fontSize="12"
        fill="var(--ifm-color-emphasis-800)">Sie heißt jetzt „Einschreibung" und ist ein Ding, über das man reden kann.</text>
</svg>

```java title="die Verbindung als eigene Klasse"
@Entity
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalDate enrolledOn;

    private Integer grade;
}
```

:::tip Faustregel
Frag dich bei jeder n:m-Beziehung: **Wird jemand jemals wissen wollen, wann oder wie diese Verbindung entstanden ist?**

Bei „Artikel hat Schlagwörter" lautet die Antwort meist nein — `@ManyToMany` genügt. Bei „Student belegt Kurs", „Bestellung enthält Artikel", „Mitarbeiter arbeitet in Projekt" lautet sie fast immer ja.

Der Umbau von `@ManyToMany` zu einer eigenen Klasse ist später mühsam, weil Daten schon drinstehen. Die Frage vorher zu stellen kostet nichts.
:::

## Was von allein geladen wird — und was nicht

Jede Beziehungsannotation hat eine Vorgabe dafür, ob die andere Seite sofort mitgeladen wird. Diese Vorgaben sind **nicht einheitlich**, und das ist eine häufige Fehlerquelle.

| Annotation | Vorgabe | Merkhilfe |
|---|---|---|
| `@OneToOne` | **EAGER** | |
| `@ManyToOne` | **EAGER** | „to **one**" → sofort |
| `@OneToMany` | **LAZY** | |
| `@ManyToMany` | **LAZY** | „to **many**" → auf Verdacht nicht |

**Merksatz:** *Eines ist schnell geholt, viele nicht.*

`LAZY` bedeutet: Statt der echten Daten steht zunächst ein Platzhalter dort. Erst wenn jemand tatsächlich darauf zugreift, geht eine zweite Abfrage an die Datenbank — **sofern die Verbindung dann noch offen ist**. Ist sie es nicht, gibt es die Ausnahme, die du im [Webshop-Tutorial](/tutorial-04/02-die-zweite-beziehung) erlebst:

```text
Cannot lazily initialize collection of role '…' (no session)
```

:::warning `EAGER` ist selten die Lösung
Es ist die naheliegende Reparatur und meist die falsche: `EAGER` lädt **immer** mit, auch wenn es niemand braucht — und es lässt sich am Abrufort nicht mehr abschalten.

Die üblichen Wege stattdessen:

| Weg | Wann |
|---|---|
| Zugriff innerhalb einer Transaktion (`@Transactional` im Service) | Der Normalfall |
| Eine Abfrage mit `join fetch` | Wenn man weiß, dass man beides braucht |
| Gar nicht laden, sondern **zählen** (`countBy…`) | Wenn nur die Anzahl gebraucht wird |
| Ein eigener Endpunkt für die Unterobjekte | Wenn die Liste lang werden kann |
:::

## Was beim Speichern und Löschen mitgeht

`cascade` legt fest, welche Vorgänge an die andere Seite weitergereicht werden.

| Angabe | Bedeutung |
|---|---|
| `cascade = CascadeType.ALL` | Speichern, Ändern, Löschen — alles geht mit |
| `cascade = CascadeType.PERSIST` | nur das erste Speichern |
| `orphanRemoval = true` | Wird das Kind aus der Liste entfernt, wird es **gelöscht** |
| *(nichts angegeben)* | Jede Seite wird einzeln gespeichert und gelöscht |

Die Entscheidung ist **fachlich**, nicht technisch — und im Klassendiagramm steht sie schon:

| Im Diagramm | Bedeutung | In Java |
|---|---|---|
| **Komposition** (gefüllte Raute) | Der Teil kann ohne das Ganze nicht existieren | `cascade = ALL`, oft `orphanRemoval = true` |
| **Aggregation** (leere Raute) | Der Teil gehört dazu, überlebt aber | kein Cascade beim Löschen |
| **Assoziation** (schlichte Linie) | Beide sind eigenständig | kein Cascade |

Ein Werksausweis ohne Mitarbeiter ist sinnlos — Komposition. Eine Lektion ohne Kurs auch. Ein Studierender ohne Kurs dagegen bleibt ein Studierender.

:::danger Wohin ein falsches Cascade führt
`cascade = ALL` bei `@ManyToMany` bedeutet: Löschst du einen Kurs, löschst du **alle Studierenden dieses Kurses** — und mit ihnen alles, was an ihnen hängt.

Bei „viele zu viele" gehört so gut wie nie ein Lösch-Cascade hin.
:::

## Drei Fallen, die jeder einmal baut

### 1. `@Data` auf einer Klasse mit Beziehungen

Lombok erzeugt `toString()`, `equals()` und `hashCode()` über **alle** Felder. Zeigen zwei Klassen aufeinander, rufen diese Methoden sich gegenseitig auf und kommen nie zurück — das Programm bleibt stehen oder stürzt mit `StackOverflowError` ab. Bei `toString()` genügt eine einzige Logausgabe, um es auszulösen.

```java
// So nicht:
@Data
@Entity
public class Course { … @OneToMany … }

// Sondern:
@Getter
@Setter
@NoArgsConstructor
@Entity
public class Course { … }
```

Mehr dazu im Infoblatt [Lombok](/infoblaetter/lombok).

### 2. Entitäten mit Beziehungen nach außen geben

Gibt der Controller eine Entität heraus, wandert die Umwandlung nach JSON durch die ganze Beziehung — und bei einer zweiseitigen Beziehung im Kreis. Was dabei herauskommt, siehst du gemessen im [Webshop-Tutorial](/tutorial-04/02-die-zweite-beziehung).

Die Abhilfe ist ein eigenes Antwortobjekt, ein **DTO**. Es enthält nur die Felder, die in der Antwort stehen sollen, und nichts, was zurückzeigt.

### 3. Das N+1-Problem

Du holst 50 Kurse und gibst zu jedem die Zahl der Lektionen aus. Bei `LAZY` geht dafür **eine** Abfrage für die Kurse und dann **je eine pro Kurs** — 51 statt 2.

So findest du es: `spring.jpa.show-sql=true` einschalten und die Abfragen im Log **zählen**. Steht dieselbe Abfrage 50-mal untereinander, hast du es gefunden.

So behebst du es:

```java
// statt zu laden und zu zählen: zählen lassen
long count = lessonRepository.countByCourseId(courseId);

// oder in einer Abfrage mitholen
@Query("select c from Course c join fetch c.lessons")
List<Course> findAllWithLessons();
```

## Eine Prüfliste für jede neue Beziehung

1. **Welche Kardinalität?** 1:1, 1:n oder n:m — und lässt sich das an einem Beispielsatz prüfen? („Ein Kurs hat viele Lektionen, eine Lektion gehört zu einem Kurs.")
2. **Trägt die Verbindung eigene Angaben?** Wenn ja: eigene Klasse statt `@ManyToMany`.
3. **Brauche ich beide Richtungen?** Wenn nein: unidirektional, das ist weniger Code und weniger Fehlerquellen.
4. **Wo liegt der Fremdschlüssel?** Diese Seite ist die Besitzerseite. Die andere bekommt `mappedBy`.
5. **Was passiert beim Löschen des Ganzen?** Komposition oder nicht — daraus folgt das Cascade.
6. **Wird die andere Seite meistens gebraucht?** Wenn nein: `LAZY` lassen und in der Transaktion arbeiten.
7. **Nachsehen.** Anwendung starten, `show-sql` an, das erzeugte `create table` im Log lesen. Steht dort, was du gemeint hast?

Punkt 7 ist der wichtigste. Alle Beispiele in diesem Blatt sind genau so entstanden: hingeschrieben, gestartet, im Log nachgelesen.

## Weiterlesen

- [JPA und Hibernate](/infoblaetter/jpa-hibernate) — die Grundlagen: Entität, Id, Tabellenabbildung
- [Abgeleitete Abfragen](/infoblaetter/abgeleitete-abfragen) — `countByCourseId` und Verwandte
- [Lombok](/infoblaetter/lombok) — warum `@Data` und Beziehungen sich nicht vertragen
- [DTOs und Schichten](/infoblaetter/dto-schichten) — warum eine Entität mit Beziehungen keine gute Antwort ist
- [Webshop-Tutorial](/tutorial-04/) — dieselben Beziehungen an einem durchgehenden Beispiel
