package de.szut.webshop.exchangerate;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RateDto(BigDecimal rate) {
}
