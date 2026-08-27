package de.szut.gaestebuch.controller;

import de.szut.gaestebuch.service.EntryNotFoundException;
import de.szut.gaestebuch.service.InvalidEntryException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Uebersetzt fachliche Ausnahmen in HTTP-Antworten.
 *
 * Das ist die einzige Stelle, an der beide Welten aufeinandertreffen: Der
 * Service kennt nur seine Ausnahmen, der Client nur Statuscodes.
 *
 * ProblemDetail ist das Standardformat fuer Fehlerantworten nach RFC 9457 -
 * dasselbe Format, das Spring auch von sich aus liefert.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(InvalidEntryException.class)
    public ProblemDetail handleInvalidEntry(InvalidEntryException ex) {
        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("Ungueltiger Eintrag");
        return problem;
    }

    @ExceptionHandler(EntryNotFoundException.class)
    public ProblemDetail handleNotFound(EntryNotFoundException ex) {
        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Nicht gefunden");
        return problem;
    }
}
