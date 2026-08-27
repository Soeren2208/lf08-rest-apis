package de.szut.gaestebuch.service;

import de.szut.gaestebuch.model.GuestbookEntry;
import de.szut.gaestebuch.repository.GuestbookEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit-Test des Service - immer noch ohne Spring.
 *
 * Der Service braucht ein Repository. Statt einer echten Datenbank bekommt
 * er ein Doppel (Mock): ein Objekt, das so aussieht wie ein Repository,
 * aber nur das tut, was der Test ihm sagt.
 *
 * Dadurch prueft dieser Test ausschliesslich die Regeln des Service - nicht,
 * ob die Datenbank funktioniert.
 */
@DisplayName("GuestbookEntryService")
class GuestbookEntryServiceTest {

    private GuestbookEntryRepository repository;
    private GuestbookEntryService service;

    @BeforeEach
    void setUp() {
        repository = mock(GuestbookEntryRepository.class);
        service = new GuestbookEntryService(repository);
    }

    /** Baut einen Eintrag, der alle Regeln erfuellt. */
    private GuestbookEntry validEntry() {
        GuestbookEntry entry = new GuestbookEntry();
        entry.setTitle("Toller Kurs");
        entry.setComment("Hat mir gut gefallen!");
        entry.setAuthor("Anna");
        return entry;
    }

    @Test
    @DisplayName("speichert einen gueltigen Eintrag")
    void savesValidEntry() {
        // Arrange
        GuestbookEntry input = validEntry();
        when(repository.save(any(GuestbookEntry.class))).thenReturn(input);

        // Act
        GuestbookEntry result = service.create(input);

        // Assert
        assertThat(result).isSameAs(input);
        verify(repository).save(input);
    }

    @Test
    @DisplayName("speichert NICHT, wenn der Titel fehlt")
    void doesNotSaveWithoutTitle() {
        GuestbookEntry input = validEntry();
        input.setTitle("   ");

        assertThatThrownBy(() -> service.create(input))
                .isInstanceOf(InvalidEntryException.class)
                .hasMessageContaining("Titel");

        // Das ist der eigentliche Punkt: Es darf nichts in der Datenbank landen.
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("nennt im Fehlertext, welches Feld gemeint ist")
    void namesTheAffectedField() {
        GuestbookEntry input = validEntry();
        input.setAuthor(null);

        assertThatThrownBy(() -> service.create(input))
                .hasMessageContaining("Verfasser");
    }

    /**
     * Grenzwertanalyse fuer die Laengenregeln.
     * Geprueft wird jeweils die groesste erlaubte und die kleinste
     * unerlaubte Laenge - dort sitzen die Fehler.
     */
    @ParameterizedTest(name = "Titel mit {0} Zeichen -> erlaubt: {1}")
    @DisplayName("An der Laengengrenze des Titels")
    @CsvSource({
            "79, true",
            "80, true",
            "81, false"
    })
    void atTheTitleLengthBoundary(int length, boolean allowed) {
        GuestbookEntry input = validEntry();
        input.setTitle("x".repeat(length));
        when(repository.save(any(GuestbookEntry.class))).thenReturn(input);

        if (allowed) {
            assertThat(service.create(input)).isNotNull();
        } else {
            assertThatThrownBy(() -> service.create(input))
                    .isInstanceOf(InvalidEntryException.class);
        }
    }

    @Test
    @DisplayName("wirft EntryNotFoundException bei unbekannter Id")
    void throwsForUnknownId() {
        when(repository.findById(9999L)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> service.findById(9999L))
                .isInstanceOf(EntryNotFoundException.class)
                .hasMessageContaining("9999");
    }

    @Test
    @DisplayName("loescht nicht, wenn es die Id nicht gibt")
    void doesNotDeleteUnknownId() {
        when(repository.findById(9999L)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> service.deleteById(9999L))
                .isInstanceOf(EntryNotFoundException.class);

        verify(repository, never()).delete(any());
    }
}
