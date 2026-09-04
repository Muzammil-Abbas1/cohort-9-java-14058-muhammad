package backend.security;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tracks, per user, a token version that increments on password change.
 * Kept in memory rather than the database: this is a single-instance
 * project, so there's no restart-persistence or multi-instance concern
 * to justify a schema change. A version counter (rather than a
 * timestamp cutoff) avoids any clock-precision ambiguity entirely --
 * a token is valid only if its embedded version exactly matches the
 * user's current version, no timing edge cases possible.
 */
@Component
public class TokenInvalidationRegistry {

    private final Map<Long, Integer> tokenVersions = new ConcurrentHashMap<>();

    public int getCurrentVersion(Long userId) {
        return tokenVersions.getOrDefault(userId, 0);
    }

    public int incrementVersion(Long userId) {
        return tokenVersions.merge(userId, 1, Integer::sum);
    }

    public boolean isTokenInvalidated(Long userId, int tokenVersion) {
        return tokenVersion != getCurrentVersion(userId);
    }
}
