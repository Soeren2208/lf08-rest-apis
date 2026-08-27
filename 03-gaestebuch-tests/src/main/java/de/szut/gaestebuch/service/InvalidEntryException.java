package de.szut.gaestebuch.service;

/**
 * Der Eintrag verletzt eine fachliche Regel.
 *
 * Bewusst KEIN Bezug zu HTTP: Der Service weiss nicht, dass er hinter einer
 * Web-Schnittstelle steht. Welcher Statuscode daraus wird, entscheidet der
 * ApiExceptionHandler in der Web-Schicht.
 */
public class InvalidEntryException extends RuntimeException {

    public InvalidEntryException(String message) {
        super(message);
    }
}
