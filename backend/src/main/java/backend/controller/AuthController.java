package backend.controller;

import backend.dto.ChangePasswordRequest;
import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.entity.User;
import backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @Valid @RequestBody RegisterRequest request) {

        User user = userService.register(request);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @Valid @RequestBody LoginRequest request) {

        String token = userService.login(request);

        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/test-protected")
    public ResponseEntity<?> testProtected(Authentication authentication) {

        return ResponseEntity.ok(
                "Hello, " + authentication.getName() + "! Your token works."
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
        @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);

        return ResponseEntity.ok("Password changed successfully");
    }
}