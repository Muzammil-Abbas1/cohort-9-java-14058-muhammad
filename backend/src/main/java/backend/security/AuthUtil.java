package backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    public String getCurrentUserIdentifier() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return authentication.getName();
    }
}