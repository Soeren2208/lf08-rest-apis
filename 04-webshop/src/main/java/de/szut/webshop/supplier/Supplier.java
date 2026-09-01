package de.szut.webshop.supplier;

import java.util.HashSet;
import java.util.Set;

import de.szut.webshop.article.Article;
import de.szut.webshop.contact.Contact;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private Long sid;

    private String name;

    /**
     * Komposition: Der Contact gehoert zum Supplier und verschwindet mit ihm.
     * Genau das sagt die gefuellte Raute im Klassendiagramm - hier steht sie
     * als cascade = ALL.
     */
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Contact contact;

    /**
     * Die 1:n-Beziehung aus dem Klassendiagramm. mappedBy zeigt auf das Feld
     * in Article - dort liegt der Fremdschluessel.
     */
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Article> articles = new HashSet<>();
}
