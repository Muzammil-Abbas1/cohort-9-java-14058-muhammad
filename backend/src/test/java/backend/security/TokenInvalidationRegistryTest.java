package backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class TokenInvalidationRegistryTest {

    private TokenInvalidationRegistry registry;

    @BeforeEach
    void setUp() {
        registry = new TokenInvalidationRegistry();
    }

    @Test
    void isTokenInvalidated_shouldReturnFalse_whenUserHasNoInvalidation() {
        assertFalse(registry.isTokenInvalidated(1L, Instant.now()));
    }

    @Test
    void isTokenInvalidated_shouldReturnTrue_whenTokenIssuedBeforeCutoff() {
        Instant cutoff = Instant.now();
        Instant tokenIssuedAt = cutoff.minusSeconds(10);

        registry.invalidateTokensBefore(1L, cutoff);

        assertTrue(registry.isTokenInvalidated(1L, tokenIssuedAt));
    }

    @Test
    void isTokenInvalidated_shouldReturnTrue_whenTokenIssuedExactlyAtCutoff() {
        Instant cutoff = Instant.now();

        registry.invalidateTokensBefore(1L, cutoff);

        assertTrue(registry.isTokenInvalidated(1L, cutoff));
    }

    @Test
    void isTokenInvalidated_shouldReturnFalse_whenTokenIssuedAfterCutoff() {
        Instant cutoff = Instant.now();
        Instant tokenIssuedAt = cutoff.plusSeconds(10);

        registry.invalidateTokensBefore(1L, cutoff);

        assertFalse(registry.isTokenInvalidated(1L, tokenIssuedAt));
    }

    @Test
    void isTokenInvalidated_shouldNotAffectOtherUsers() {
        registry.invalidateTokensBefore(1L, Instant.now());

        assertFalse(registry.isTokenInvalidated(2L, Instant.now().minusSeconds(10)));
    }

    @Test
    void forgetEntriesOlderThan_shouldRemoveStaleEntries() {
        Instant oldCutoff = Instant.now().minusSeconds(100);
        registry.invalidateTokensBefore(1L, oldCutoff);

        registry.forgetEntriesOlderThan(Instant.now().minusSeconds(50));

        // Entry removed, so a previously-invalidated token now reads as valid
        // again -- correct, since it would already have expired naturally
        // by the time an entry is old enough to be swept.
        assertFalse(registry.isTokenInvalidated(1L, oldCutoff.minusSeconds(1)));
    }

    @Test
    void forgetEntriesOlderThan_shouldKeepRecentEntries() {
        Instant recentCutoff = Instant.now();
        registry.invalidateTokensBefore(1L, recentCutoff);

        registry.forgetEntriesOlderThan(Instant.now().minusSeconds(50));

        assertTrue(registry.isTokenInvalidated(1L, recentCutoff.minusSeconds(1)));
    }
}
