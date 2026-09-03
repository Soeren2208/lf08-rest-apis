package de.szut.webshop.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Ein Lieferant.
 *
 * Kein @Data: Die Klasse steht in Beziehungen, und die von @Data erzeugten
 * Methoden toString(), equals() und hashCode() wuerden sich darin im Kreis
 * drehen. Getter, Setter und der parameterlose Konstruktor genuegen.
 */
@Entity
@Table(name = "supplier")
@Getter
@Setter
@NoArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    /**
     * Die gefuellte Raute aus dem Klassendiagramm: Der Contact gehoert zum
     * Supplier und verschwindet mit ihm. cascade = ALL reicht die Befehle
     * weiter, orphanRemoval loescht ihn auch dann, wenn er nur abgehaengt wird.
     */
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    /**
     * Die schlichte Assoziation aus dem Klassendiagramm: Artikel gehoeren
     * NICHT zum Lieferanten - deshalb kein cascade. Wer einen Lieferanten
     * loescht, muss sich vorher um seine Artikel kuemmern.
     *
     * mappedBy zeigt auf das Feld "supplier" in Article. Dort liegt der
     * Fremdschluessel, hier steht nur die Gegenrichtung.
     */
    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
    private List<Article> articles = new ArrayList<>();
}
