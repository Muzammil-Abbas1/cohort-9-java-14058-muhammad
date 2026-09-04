package backend.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Tracks, per user, the moment after which any earlier-issued JWT should be
 * rejected (e.g. because the password changed). Kept in memory rather than
 * the database: entries are keyed by user, not by token, so the map stays
 * tiny, and any entry older than a token's own lifetime is harmless dead
 * weight since JwtUtil's own expiry check would already reject that token --
 * so a stale entry is swept out the next time this user invalidates again,
 * rather than needing a separate scheduled job.
 */
@Component
public class TokenInvalidationRegistry {

    private final Map<Long, Instant> invalidatedBefore = new ConcurrentHashMap<>();

    public void invalidateTokensBefore(Long userId, Instant cutoff) {
        invalidatedBefore.put(userId, cutoff);
    }

    public boolean isTokenInvalidated(Long userId, Instant tokenIssuedAt) {
        Instant cutoff = invalidatedBefore.get(userId);
        return cutoff != null && !tokenIssuedAt.isAfter(cutoff);
    }

    public void forgetEntriesOlderThan(Instant threshold) {
        invalidatedBefore.values().removeIf(cutoff -> cutoff.isBefore(threshold));
    }
}
