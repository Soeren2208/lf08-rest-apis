package de.szut.gaestebuch.service;

/**
 * Kuerzt einen Kommentar auf eine Vorschauzeile.
 *
 * Diese Klasse haengt von nichts ab: kein Spring, keine Datenbank, kein
 * HTTP. Gleiche Eingabe, gleiche Ausgabe - immer. Genau deshalb laesst sie
 * sich mit einem gewoehnlichen Unit-Test pruefen.
 */
public final class CommentPreview {

    /** Laenge der Vorschau in Zeichen - einschliesslich der Auslassungspunkte. */
    public static final int MAX_LENGTH = 60;

    private CommentPreview() {
        // Werkzeugklasse - wird nicht instanziiert.
    }

    /**
     * Liefert die Vorschauzeile zu einem Kommentar.
     *
     * <ul>
     *   <li>null oder leer -> leerer Text</li>
     *   <li>hoechstens MAX_LENGTH Zeichen -> unveraendert</li>
     *   <li>laenger -> abgeschnitten, mit "…" am Ende, insgesamt MAX_LENGTH Zeichen</li>
     * </ul>
     */
    public static String shorten(String comment) {
        if (comment == null) {
            return "";
        }
        if (comment.length() <= MAX_LENGTH) {
            return comment;
        }
        return comment.substring(0, MAX_LENGTH - 1) + "…";
    }
}
