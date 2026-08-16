package backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

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
}