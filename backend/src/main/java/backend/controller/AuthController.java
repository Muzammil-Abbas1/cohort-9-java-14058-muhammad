package backend.controller;

import backend.dto.ChangePasswordRequest;
import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.dto.UserResponse;
import backend.entity.User;
import backend.exception.BadRequestException;
import backend.exception.ResourceNotFoundException;
import backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @Value("${cookie.secure:false}")
    private boolean cookieSecure;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = userService.register(request);

        UserResponse response = new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        try {

            String token = userService.login(request);

            Cookie cookie = new Cookie("access_token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(cookieSecure);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60); // 1 hour

            response.addCookie(cookie);

            return ResponseEntity.ok(
                    Map.of("message", "Login successful")
            );

        } catch (ResourceNotFoundException | BadRequestException ex) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "error",
                                    "Invalid email or password"
                            )
                    );
        }
    }

    @PostMapping("/logout")
   public ResponseEntity<Map<String, String>> logout(
        HttpServletResponse response) {

    Cookie cookie = new Cookie("access_token", null);
    cookie.setHttpOnly(true);
    cookie.setSecure(cookieSecure);
    cookie.setPath("/");
    cookie.setMaxAge(0);

    response.addCookie(cookie);

    return ResponseEntity.ok(
            Map.of("message", "Logged out successfully")
    );
  }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {

        UserResponse profile =
                userService.getCurrentUserProfile();

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/test-protected")
    public ResponseEntity<String> testProtected(
            Authentication authentication) {

        return ResponseEntity.ok(
                "Hello, " + authentication.getName()
                        + "! Your token works."
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);

        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }
}