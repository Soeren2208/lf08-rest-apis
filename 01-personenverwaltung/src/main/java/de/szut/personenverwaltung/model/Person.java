package de.szut.personenverwaltung.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Eine Person, die der Web Service verwaltet.
 *
 * Die Annotation @Entity macht aus dieser Klasse eine JPA-Entitaet:
 * Hibernate legt beim Start automatisch eine Tabelle PERSON an und
 * bildet jedes Attribut auf eine Spalte ab.
 */
@Entity
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String firstname;

    private String surname;

    /** JPA benoetigt einen parameterlosen Konstruktor. */
    public Person() {
    }

    public Person(String firstname, String surname) {
        this.firstname = firstname;
        this.surname = surname;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }
}
