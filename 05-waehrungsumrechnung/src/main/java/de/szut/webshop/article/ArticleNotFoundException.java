package de.szut.webshop.article;

public class ArticleNotFoundException extends RuntimeException {

    public ArticleNotFoundException(Long id) {
        super("Es gibt keinen Artikel mit der Kennung " + id + ".");
    }
}
