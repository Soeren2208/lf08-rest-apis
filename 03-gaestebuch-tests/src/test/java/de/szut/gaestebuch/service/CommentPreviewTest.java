package de.szut.gaestebuch.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit-Test: prueft EINE Klasse, ohne Spring, ohne Datenbank.
 *
 * Diese Testklasse startet nichts. Sie laeuft in Millisekunden, weil sie
 * nichts hochfahren muss.
 */
@DisplayName("CommentPreview")
class CommentPreviewTest {

    /** Erzeugt einen Text aus genau so vielen Zeichen. */
    private String textMitLaenge(int laenge) {
        return "x".repeat(laenge);
    }

    @Test
    @DisplayName("null wird zu leerem Text")
    void nullWirdZuLeeremText() {
        // Arrange - hier nichts vorzubereiten

        // Act
        String ergebnis = CommentPreview.shorten(null);

        // Assert
        assertThat(ergebnis).isEmpty();
    }

    @Test
    @DisplayName("kurzer Kommentar bleibt unveraendert")
    void kurzerKommentarBleibtUnveraendert() {
        String kommentar = "Hat mir gut gefallen!";

        String ergebnis = CommentPreview.shorten(kommentar);

        assertThat(ergebnis).isEqualTo(kommentar);
    }

    /**
     * Grenzwertanalyse: Die Regel wechselt zwischen 60 und 61 Zeichen.
     * Geprueft werden beide Seiten der Grenze und die Grenze selbst.
     */
    @ParameterizedTest(name = "{0} Zeichen -> unveraendert: {1}")
    @DisplayName("An der Grenze von 60 Zeichen")
    @CsvSource({
            "59, true",
            "60, true",
            "61, false"
    })
    void anDerGrenze(int laenge, boolean bleibtUnveraendert) {
        String kommentar = textMitLaenge(laenge);

        String ergebnis = CommentPreview.shorten(kommentar);

        assertThat(ergebnis.equals(kommentar)).isEqualTo(bleibtUnveraendert);
    }

    @Test
    @DisplayName("langer Kommentar wird auf genau 60 Zeichen gekuerzt")
    void langerKommentarWirdGekuerzt() {
        String kommentar = textMitLaenge(200);

        String ergebnis = CommentPreview.shorten(kommentar);

        assertThat(ergebnis).hasSize(CommentPreview.MAX_LENGTH);
        assertThat(ergebnis).endsWith("…");
    }

    @Test
    @DisplayName("der Anfang des Kommentars bleibt lesbar")
    void derAnfangBleibtLesbar() {
        String kommentar = "Sehr schoene Ausstellung, wir kommen im naechsten Jahr wieder "
                + "und bringen die ganze Familie mit.";

        String ergebnis = CommentPreview.shorten(kommentar);

        assertThat(ergebnis).startsWith("Sehr schoene Ausstellung");
    }
}
