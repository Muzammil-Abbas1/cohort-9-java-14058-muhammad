package backend.controller;

import backend.dto.ChangePasswordRequest;
import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.dto.UserResponse;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import jakarta.validation.Valid;

import backend.exception.BadRequestException;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

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
        @Valid @RequestBody LoginRequest request) {

    try {

        String token = userService.login(request);

        return ResponseEntity.ok(
                Map.of("token", token)
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

@GetMapping("/me")
public ResponseEntity<UserResponse> getCurrentUser() {

    UserResponse profile =
            userService.getCurrentUserProfile();

    return ResponseEntity.ok(profile);
}



      @GetMapping("/test-protected")
       public ResponseEntity<String> testProtected(Authentication authentication) {
             return ResponseEntity.ok(
            "Hello, " + authentication.getName() + "! Your token works."
       );
       }

      @PutMapping("/change-password")
       public ResponseEntity<String> changePassword(
        @Valid @RequestBody ChangePasswordRequest request) {

      userService.changePassword(request);

      return ResponseEntity.ok("Password changed successfully");
     }
}