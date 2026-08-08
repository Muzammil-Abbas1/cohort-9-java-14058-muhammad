package backend.service;

import backend.dto.ChangePasswordRequest;
import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
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


@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger =
            LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthUtil authUtil;

    // ================= REGISTER =================

    public User register(RegisterRequest request) {

        if (request.getEmail() == null && request.getPhone() == null) {
            throw new BadRequestException("Email or phone is required");
        }

        if (request.getEmail() != null &&
                userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("Email already registered");
        }

        if (request.getPhone() != null &&
                userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new ConflictException("Phone already registered");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        logger.info("New user registered: {}",
                request.getEmail() != null
                        ? request.getEmail()
                        : request.getPhone());

        return userRepository.save(user);
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

    // ================= CHANGE PASSWORD =================

    public void changePassword(ChangePasswordRequest request) {

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

           logger.info("Password changed successfully for user id={}",
            user.getId());
    }  
}