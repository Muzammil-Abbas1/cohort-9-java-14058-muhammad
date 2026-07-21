package backend.controller;

import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.entity.User;
import backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import org.springframework.security.core.Authentication;

import backend.dto.ChangePasswordRequest;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = userService.login(request);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/test-protected")
 public ResponseEntity<?> testProtected(Authentication authentication) {

    return ResponseEntity.ok(
            "Hello, " + authentication.getName() + "! Your token works."
    );
  }
  @PutMapping("/change-password")
public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
    try {
        userService.changePassword(request);
        return ResponseEntity.ok("Password changed successfully");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}