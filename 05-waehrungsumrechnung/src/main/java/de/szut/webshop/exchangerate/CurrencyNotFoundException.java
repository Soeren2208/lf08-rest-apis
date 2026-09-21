package de.szut.webshop.exchangerate;

public class CurrencyNotFoundException extends RuntimeException {

    public CurrencyNotFoundException(String currency) {
        super("Es gibt keine Währung mit dem Code " + currency + ".");
    }
}
