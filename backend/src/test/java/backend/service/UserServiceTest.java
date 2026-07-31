package backend.service;

import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.entity.User;
import backend.repository.UserRepository;
import backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {

        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Ali");
        registerRequest.setLastName("Khan");
        registerRequest.setEmail("ali@example.com");
        registerRequest.setPhone(null);
        registerRequest.setPassword("password123");
    }

    @Test
    void register_shouldSaveUser_whenEmailNotTaken() {

        when(userRepository.findByEmail("ali@example.com"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.register(registerRequest);

        assertNotNull(result);
        assertEquals("Ali", result.getFirstName());
        assertEquals("Khan", result.getLastName());
        assertEquals("ali@example.com", result.getEmail());
        assertEquals("encodedPassword", result.getPassword());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_shouldThrowException_whenEmailAlreadyExists() {

        when(userRepository.findByEmail("ali@example.com"))
                .thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.register(registerRequest)
        );

        assertEquals("Email already registered", exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_shouldReturnToken_whenCredentialsAreCorrect() {

        User user = new User();
        user.setEmail("ali@example.com");
        user.setPassword("encodedPassword");

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmailOrPhone("ali@example.com");
        loginRequest.setPassword("password123");

        when(userRepository.findByEmail("ali@example.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("password123", "encodedPassword"))
                .thenReturn(true);

        when(jwtUtil.generateToken("ali@example.com"))
                .thenReturn("fake-jwt-token");

        String token = userService.login(loginRequest);

        assertEquals("fake-jwt-token", token);
    }

    @Test
    void login_shouldThrowException_whenPasswordIsWrong() {

        User user = new User();
        user.setEmail("ali@example.com");
        user.setPassword("encodedPassword");

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmailOrPhone("ali@example.com");
        loginRequest.setPassword("wrongPassword");

        when(userRepository.findByEmail("ali@example.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("wrongPassword", "encodedPassword"))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.login(loginRequest)
        );

        assertEquals("Invalid password", exception.getMessage());
    }
}