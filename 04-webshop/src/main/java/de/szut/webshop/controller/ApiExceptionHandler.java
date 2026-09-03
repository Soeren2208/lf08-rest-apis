package de.szut.webshop.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import de.szut.webshop.service.SupplierHasArticlesException;
import de.szut.webshop.service.SupplierNotFoundException;

/**
 * Uebersetzt fachliche Ausnahmen in HTTP-Antworten.
 *
 * Das ist die einzige Stelle, an der beide Welten aufeinandertreffen: Der
 * Service kennt nur seine Ausnahmen, der Client nur Statuscodes.
 *
 * ProblemDetail ist das Standardformat fuer Fehlerantworten nach RFC 9457 -
 * dasselbe Format, das Spring auch von sich aus liefert.
 *
 * @Order ist noetig, weil Spring wegen spring.mvc.problemdetails.enabled=true
 * bereits einen eigenen Ausnahmebehandler mitbringt. Der faengt unter anderem
 * die Verstoesse der Bean Validation ab - und ohne diese Zeile kaeme unsere
 * Methode dafuer nie an die Reihe.
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiExceptionHandler {

    @ExceptionHandler(SupplierNotFoundException.class)
    public ProblemDetail handleNotFound(SupplierNotFoundException ex) {
        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Nicht gefunden");
        return problem;
    }

    /**
     * 409 Conflict: Die Anfrage war richtig formuliert, sie passt nur nicht
     * zum aktuellen Zustand der Daten. Ein 400 waere hier falsch - der Client
     * hat nichts falsch gemacht.
     */
    @ExceptionHandler(SupplierHasArticlesException.class)
    public ProblemDetail handleConflict(SupplierHasArticlesException ex) {
        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Löschen nicht möglich");
        return problem;
    }

    /**
     * 400 Bad Request: Die Bean Validation hat zugeschlagen.
     *
     * Ohne diese Methode antwortet Spring zwar auch mit 400, aber nur mit
     * "Invalid request content." - der Client erfaehrt nicht, welches Feld
     * es war. Hier wandert jeder Verstoss einzeln in die Antwort.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(
                error -> errors.put(error.getField(), error.getDefaultMessage()));

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Die Anfrage enthält ungültige Felder.");
        problem.setTitle("Ungültige Eingabe");
        problem.setProperty("errors", errors);
        return problem;
    }
}
