package backend.security;

import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.exception.UnauthorizedException;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;


import backend.exception.AuthenticationException;

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

                throw new AuthenticationException("User is not authenticated");
        }

        return authentication.getName();
    }

     public User getCurrentUser() {

      Long userId;
  
       try {
            userId = Long.valueOf(getCurrentUserIdentifier());
           } catch (NumberFormatException e) {
             throw new AuthenticationException("Invalid authentication token");
           }

           return userRepository.findById(userId)
                 .orElseThrow(() ->
                    new ResourceNotFoundException("Logged-in user not found"));
}
}