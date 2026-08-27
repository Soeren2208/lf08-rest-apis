package de.szut.gaestebuch.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

/**
 * Gibt der erzeugten OpenAPI-Beschreibung einen eigenen Titel.
 *
 * Ohne diese Klasse heisst die Schnittstelle in der Swagger-UI
 * "OpenAPI definition v0" - siehe Arbeitsblatt 4, Aufgabe 3.
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Gästebuch-API",
                version = "v1",
                description = "Schnittstelle zum Anlegen, Lesen, Ändern "
                            + "und Löschen von Gästebucheinträgen."))
public class OpenApiConfig {
}
