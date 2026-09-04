package backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenInvalidationRegistryTest {

    private TokenInvalidationRegistry registry;

    @BeforeEach
    void setUp() {
        registry = new TokenInvalidationRegistry();
    }

    @Test
    void getCurrentVersion_shouldReturnZero_forUserWithNoHistory() {
        assertEquals(0, registry.getCurrentVersion(1L));
    }

    @Test
    void incrementVersion_shouldReturnOne_onFirstCall() {
        assertEquals(1, registry.incrementVersion(1L));
    }

    @Test
    void incrementVersion_shouldKeepIncrementing() {
        registry.incrementVersion(1L);
        registry.incrementVersion(1L);

        assertEquals(3, registry.incrementVersion(1L));
    }

    @Test
    void incrementVersion_shouldNotAffectOtherUsers() {
        registry.incrementVersion(1L);

        assertEquals(0, registry.getCurrentVersion(2L));
    }

    @Test
    void isTokenInvalidated_shouldReturnFalse_whenVersionMatchesCurrent() {
        int version = registry.incrementVersion(1L);

        assertFalse(registry.isTokenInvalidated(1L, version));
    }

    @Test
    void isTokenInvalidated_shouldReturnTrue_whenVersionIsOlderThanCurrent() {
        int oldVersion = registry.getCurrentVersion(1L);
        registry.incrementVersion(1L);

        assertTrue(registry.isTokenInvalidated(1L, oldVersion));
    }

    @Test
    void isTokenInvalidated_shouldReturnFalse_forUserWithNoHistory_whenTokenVersionIsZero() {
        assertFalse(registry.isTokenInvalidated(1L, 0));
    }
}
