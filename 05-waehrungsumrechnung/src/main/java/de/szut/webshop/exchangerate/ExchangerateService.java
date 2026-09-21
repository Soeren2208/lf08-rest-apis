package de.szut.webshop.exchangerate;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Service
public class ExchangerateService {

    private final RestClient restClient = RestClient.create();

    @Value("${exchangerate.api.url}")
    private String apiUrl;

    public BigDecimal convert(BigDecimal amount, String currency) {
        try {
            RateDto rate = restClient.get()
                    .uri(apiUrl + "/EUR/{currency}", currency)
                    .retrieve()
                    .body(RateDto.class);
            return amount.multiply(rate.rate()).setScale(2, RoundingMode.HALF_UP);
        } catch (HttpClientErrorException.UnprocessableContent e) {
            throw new CurrencyNotFoundException(currency);
        }
    }
}
