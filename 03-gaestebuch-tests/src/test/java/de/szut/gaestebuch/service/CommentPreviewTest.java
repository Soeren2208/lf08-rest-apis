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
    private String textOfLength(int length) {
        return "x".repeat(length);
    }

    @Test
    @DisplayName("null wird zu leerem Text")
    void nullBecomesEmptyText() {
        // Arrange - hier nichts vorzubereiten

        // Act
        String result = CommentPreview.shorten(null);

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("kurzer Kommentar bleibt unveraendert")
    void shortCommentStaysUnchanged() {
        String comment = "Hat mir gut gefallen!";

        String result = CommentPreview.shorten(comment);

        assertThat(result).isEqualTo(comment);
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
    void atTheBoundary(int length, boolean staysUnchanged) {
        String comment = textOfLength(length);

        String result = CommentPreview.shorten(comment);

        assertThat(result.equals(comment)).isEqualTo(staysUnchanged);
    }

    @Test
    @DisplayName("langer Kommentar wird auf genau 60 Zeichen gekuerzt")
    void longCommentIsShortened() {
        String comment = textOfLength(200);

        String result = CommentPreview.shorten(comment);

        assertThat(result).hasSize(CommentPreview.MAX_LENGTH);
        assertThat(result).endsWith("…");
    }

    @Test
    @DisplayName("der Anfang des Kommentars bleibt lesbar")
    void beginningStaysReadable() {
        String comment = "Sehr schoene Ausstellung, wir kommen im naechsten Jahr wieder "
                + "und bringen die ganze Familie mit.";

        String result = CommentPreview.shorten(comment);

        assertThat(result).startsWith("Sehr schoene Ausstellung");
    }
}
