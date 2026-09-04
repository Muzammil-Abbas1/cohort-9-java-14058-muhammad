package backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final TokenInvalidationRegistry tokenInvalidationRegistry;

    public JwtFilter(JwtUtil jwtUtil, TokenInvalidationRegistry tokenInvalidationRegistry) {
        this.jwtUtil = jwtUtil;
        this.tokenInvalidationRegistry = tokenInvalidationRegistry;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String token = getTokenFromCookie(request);

        if (token != null && jwtUtil.isTokenValid(token) && !isInvalidated(token)) {

            String subject = jwtUtil.extractSubject(token);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            subject,
                            null,
                            Collections.emptyList()
                    );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isInvalidated(String token) {
        try {
            Long userId = Long.valueOf(jwtUtil.extractSubject(token));
            return tokenInvalidationRegistry.isTokenInvalidated(
                    userId,
                    jwtUtil.extractTokenVersion(token)
            );
        } catch (NumberFormatException e) {
            return true;
        }
    }

    private String getTokenFromCookie(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {

            if ("access_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}