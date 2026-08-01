package backend.security;

import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.exception.UnauthorizedException;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUtil {

    private final UserRepository userRepository;

    public String getCurrentUserIdentifier() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new UnauthorizedException("User is not authenticated");
        }

        return authentication.getName();
    }

    public User getCurrentUser() {

        String identifier = getCurrentUserIdentifier();

        return userRepository.findByEmailOrPhone(identifier)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Logged-in user not found"));
    }
}