package backend.service;

import backend.dto.ChangePasswordRequest;
import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.dto.UserResponse;
import backend.entity.User;
import backend.exception.BadRequestException;
import backend.exception.ConflictException;
import backend.exception.ResourceNotFoundException;
import backend.repository.UserRepository;
import backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import backend.security.AuthUtil;
import backend.security.TokenInvalidationRegistry;

import java.time.Instant;


@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger =
            LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthUtil authUtil;
    private final TokenInvalidationRegistry tokenInvalidationRegistry;

    // ================= REGISTER =================

    public User register(RegisterRequest request) {

        String email = normalizeBlank(request.getEmail());
        String phone = normalizeBlank(request.getPhone());

        if (email == null && phone == null) {
            throw new BadRequestException("Email or phone is required");
        }

        if (email != null &&
                userRepository.findByEmail(email).isPresent()) {
            throw new ConflictException("Email already registered");
        }

        if (phone != null &&
                userRepository.findByPhone(phone).isPresent()) {
            throw new ConflictException("Phone already registered");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        logger.info("New user registered: {}",
                email != null ? email : phone);

        return userRepository.save(user);
    }

    private String normalizeBlank(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    // ================= LOGIN =================

    public String login(LoginRequest request) {

        User user = userRepository.findByEmailOrPhone(request.getEmailOrPhone())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            logger.warn("Failed login attempt for: {}",
                    request.getEmailOrPhone());

            throw new BadRequestException("Invalid password");
        }

        logger.info("User logged in: {}",
        request.getEmailOrPhone());

        return jwtUtil.generateToken(user.getId().toString());
     }

    // ================= CURRENT USER =================

    public UserResponse getCurrentUserProfile() {

        User user = authUtil.getCurrentUser();

        return new UserResponse(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPhone()
       );
    }


    // ================= CHANGE PASSWORD =================

    /**
     * Changes the password and invalidates every token issued before now,
     * so a stolen/old session cookie stops working. A fresh token is
     * generated and returned so the caller's own current session -- the one
     * making this very request -- keeps working without being logged out
     * by its own password change.
     */
    public String changePassword(ChangePasswordRequest request) {

         User user = authUtil.getCurrentUser();

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

               logger.warn("Failed password change attempt for user id={}",
                user.getId());

            throw new BadRequestException("Old password is incorrect");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        // A 1-second safety margin avoids a razor-thin race where the new
        // token generated a few lines below could end up timestamped at or
        // before the cutoff (JWT timestamps only carry millisecond
        // precision, so back-to-back Instant.now() calls could collide).
        Instant cutoff = Instant.now().minusSeconds(1);

        tokenInvalidationRegistry.invalidateTokensBefore(user.getId(), cutoff);
        tokenInvalidationRegistry.forgetEntriesOlderThan(
                cutoff.minusMillis(jwtUtil.getExpirationTimeMillis()));

        String newToken = jwtUtil.generateToken(user.getId().toString());

           logger.info("Password changed successfully for user id={}",
            user.getId());

        return newToken;
    }
}