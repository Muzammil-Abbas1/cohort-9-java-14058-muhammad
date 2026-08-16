package backend.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    void handleBadRequest_shouldReturnBadRequest() {
        BadRequestException exception =
                new BadRequestException("Bad request");

        ResponseEntity<Map<String, String>> response =
                handler.handleBadRequest(exception);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Bad request", response.getBody().get("error"));
    }

    @Test
    void handleConflict_shouldReturnConflict() {
        ConflictException exception =
                new ConflictException("Conflict");

        ResponseEntity<Map<String, String>> response =
                handler.handleConflict(exception);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("Conflict", response.getBody().get("error"));
    }

    @Test
    void handleNotFound_shouldReturnNotFound() {
        ResourceNotFoundException exception =
                new ResourceNotFoundException("Not found");

        ResponseEntity<Map<String, String>> response =
                handler.handleNotFound(exception);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Not found", response.getBody().get("error"));
    }

    @Test
    void handleUnauthorized_shouldReturnForbidden() {
        UnauthorizedException exception =
                new UnauthorizedException("Unauthorized");

        ResponseEntity<Map<String, String>> response =
                handler.handleUnauthorized(exception);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Unauthorized", response.getBody().get("error"));
    }

    @Test
    void handleRuntime_shouldReturnBadRequest() {
        RuntimeException exception =
                new RuntimeException("Runtime error");

        ResponseEntity<Map<String, String>> response =
                handler.handleRuntime(exception);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Runtime error", response.getBody().get("error"));
    }

    @Test
    void handleException_shouldReturnInternalServerError() {
        Exception exception =
                new Exception("Unexpected error");

        ResponseEntity<Map<String, String>> response =
                handler.handleException(exception);

        assertEquals(
                HttpStatus.INTERNAL_SERVER_ERROR,
                response.getStatusCode()
        );

        assertEquals(
                "Something went wrong. Please try again later.",
                response.getBody().get("error")
        );
    }

    @Test
    void handleAuthentication_shouldReturnUnauthorized() {
        AuthenticationException exception =
                new AuthenticationException("Authentication failed") {
                };

        ResponseEntity<Map<String, String>> response =
                handler.handleAuthentication(exception);

        assertEquals(
                HttpStatus.UNAUTHORIZED,
                response.getStatusCode()
        );

        assertEquals(
                "Authentication required",
                response.getBody().get("error")
        );
    }
}