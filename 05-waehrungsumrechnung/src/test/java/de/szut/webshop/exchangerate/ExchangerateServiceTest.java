package de.szut.webshop.exchangerate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

/**
 * Ruft die echte Frankfurter-API auf - kein Mock, keine Spring-Testschicht.
 * Braucht eine Internetverbindung, sonst schlaegt der Test fehl.
 */
@DisplayName("ExchangerateService (echte API)")
class ExchangerateServiceTest {

    private final ExchangerateService service = new ExchangerateService();

    ExchangerateServiceTest() {
        ReflectionTestUtils.setField(service, "apiUrl", "https://api.frankfurter.dev/v2/rate");
    }

    @Test
    @DisplayName("rechnet einen Betrag in eine gueltige Waehrung um")
    void convertsToKnownCurrency() {
        BigDecimal result = service.convert(new BigDecimal("100.00"), "USD");

        assertThat(result).isGreaterThan(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("wirft CurrencyNotFoundException bei unbekanntem Code")
    void throwsOnUnknownCurrency() {
        assertThatThrownBy(() -> service.convert(new BigDecimal("100.00"), "XXX"))
                .isInstanceOf(CurrencyNotFoundException.class)
                .hasMessageContaining("XXX");
    }
}
