package backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() throws Exception {
        jwtUtil = new JwtUtil();

        Field secretField = JwtUtil.class.getDeclaredField("secret");
        secretField.setAccessible(true);
        secretField.set(jwtUtil, "my-test-secret-key-for-jwt-testing-123456789");

        jwtUtil.init();
    }

    @Test
    void generateToken_shouldCreateValidToken() {
        String token = jwtUtil.generateToken("ali@example.com");

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void extractSubject_shouldReturnSubject() {
        String token = jwtUtil.generateToken("ali@example.com");

        String subject = jwtUtil.extractSubject(token);

        assertEquals("ali@example.com", subject);
    }

    @Test
    void isTokenValid_shouldReturnTrueForValidToken() {
        String token = jwtUtil.generateToken("ali@example.com");

        assertTrue(jwtUtil.isTokenValid(token));
    }

    @Test
    void isTokenValid_shouldReturnFalseForInvalidToken() {
        assertFalse(jwtUtil.isTokenValid("invalid-token"));
    }

    @Test
    void extractIssuedAt_shouldReturnRecentInstant() {
        Instant before = Instant.now().minusSeconds(5);

        String token = jwtUtil.generateToken("ali@example.com");

        Instant issuedAt = jwtUtil.extractIssuedAt(token);
        Instant after = Instant.now().plusSeconds(5);

        assertTrue(issuedAt.isAfter(before));
        assertTrue(issuedAt.isBefore(after));
    }

    @Test
    void getExpirationTimeMillis_shouldReturnTenHours() {
        assertEquals(10L * 60 * 60 * 1000, jwtUtil.getExpirationTimeMillis());
    }
}