package de.szut.personenverwaltung.controller;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Der einfachste denkbare REST-Controller: ein einziger GET-Endpunkt,
 * der noch keine Datenbank braucht.
 *
 * @RestController sagt Spring: Diese Klasse bietet REST-Endpunkte an.
 *                 Rueckgabewerte werden automatisch in JSON umgewandelt.
 * @RequestMapping  legt den gemeinsamen Pfadanfang aller Endpunkte fest.
 */
@RestController
@RequestMapping("/api/v1/welcome")
public class WelcomeController {

    @GetMapping
    public Greeting welcome() {
        return new Greeting("Willkommen bei der Personenverwaltung!", LocalDateTime.now());
    }
}
