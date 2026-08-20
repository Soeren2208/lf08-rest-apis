package de.szut.personenverwaltung.controller;

import java.time.LocalDateTime;

/**
 * Ein Record: eine unveraenderliche Datenklasse.
 *
 * Diese eine Zeile ersetzt Konstruktor, Getter, equals(), hashCode()
 * und toString(). Spring wandelt den Record automatisch in JSON um:
 *
 *   { "message": "...", "time": "2026-08-17T18:30:00" }
 */
public record Greeting(String message, LocalDateTime time) {
}
