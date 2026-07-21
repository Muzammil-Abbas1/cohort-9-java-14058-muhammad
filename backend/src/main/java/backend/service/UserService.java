package backend.service;

import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.entity.User;
import backend.repository.UserRepository;
import backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import backend.dto.ChangePasswordRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
@RequiredArgsConstructor
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public User register(RegisterRequest request) {

        if (request.getEmail() == null && request.getPhone() == null) {
            throw new RuntimeException("Email or phone is required");
        }

        if (request.getEmail() != null &&
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (request.getPhone() != null &&
                userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Phone already registered");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

       logger.info("New user registered: {}",
        request.getEmail() != null ? request.getEmail() : request.getPhone());

       return userRepository.save(user);
    }
    public String login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmailOrPhone())
            .or(() -> userRepository.findByPhone(request.getEmailOrPhone()))
            .orElseThrow(() -> new RuntimeException("User not found"));

     if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
         logger.warn("Failed login attempt for: {}", request.getEmailOrPhone());
         throw new RuntimeException("Invalid password");
        }
     

    String subject = user.getEmail() != null
            ? user.getEmail()
            : user.getPhone();

     logger.info("User logged in: {}", request.getEmailOrPhone());

    return jwtUtil.generateToken(subject);
}
 public void changePassword(ChangePasswordRequest request) {

    User user = userRepository.findByEmail(request.getEmailOrPhone())
            .or(() -> userRepository.findByPhone(request.getEmailOrPhone()))
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
        logger.warn("Failed password change attempt for user: {}", request.getEmailOrPhone());
        throw new RuntimeException("Old password is incorrect");
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);

    logger.info("Password changed successfully for user: {}", request.getEmailOrPhone());
}
}