package de.szut.gaestebuch.service;

/** Zu dieser Id gibt es keinen Eintrag. */
public class EntryNotFoundException extends RuntimeException {

    public EntryNotFoundException(Long id) {
        super("Kein Gaestebucheintrag mit der Id " + id);
    }
}
