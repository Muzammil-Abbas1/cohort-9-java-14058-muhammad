package backend.controller;

import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.entity.User;
import backend.exception.BadRequestException;
import backend.exception.ConflictException;
import backend.exception.ResourceNotFoundException;
import backend.security.JwtUtil;
import backend.service.UserService;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private UserService userService;

    /*
     * JwtFilter requires JwtUtil.
     *
     * @WebMvcTest does not load the real JwtUtil bean,
     * so we provide a mock for the test context.
     */
    @MockitoBean
    private JwtUtil jwtUtil;


    // =========================================================
    // REGISTER - SUCCESS
    // =========================================================

    @Test
    void register_shouldReturn200_whenRequestIsValid() throws Exception {

        RegisterRequest request = new RegisterRequest();

        request.setFirstName("Ali");
        request.setLastName("Khan");
        request.setEmail("ali@example.com");
        request.setPhone(null);
        request.setPassword("password123");


        User user = new User();

        user.setId(1L);
        user.setFirstName("Ali");
        user.setLastName("Khan");
        user.setEmail("ali@example.com");
        user.setPhone(null);
        user.setPassword("encodedPassword");


        when(userService.register(any(RegisterRequest.class)))
                .thenReturn(user);


        mockMvc.perform(
                post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.firstName").value("Ali"))
        .andExpect(jsonPath("$.lastName").value("Khan"))
        .andExpect(jsonPath("$.email").value("ali@example.com"))
        .andExpect(jsonPath("$.phone").doesNotExist())
        .andExpect(jsonPath("$.password").doesNotExist());
    }


    // =========================================================
    // REGISTER - VALIDATION ERROR
    // =========================================================

    @Test
    void register_shouldReturn400_whenFirstNameIsBlank() throws Exception {

        RegisterRequest request = new RegisterRequest();

        request.setFirstName("");
        request.setLastName("Khan");
        request.setEmail("ali@example.com");
        request.setPhone(null);
        request.setPassword("password123");


        mockMvc.perform(
                post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request))
        )
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.firstName").exists());
    }


    // =========================================================
    // LOGIN - INVALID USER
    // =========================================================

    @Test
    void login_shouldReturn401_whenUserDoesNotExist() throws Exception {

        LoginRequest request = new LoginRequest();

        request.setEmailOrPhone("wrong@example.com");
        request.setPassword("wrongpass");


        when(userService.login(any(LoginRequest.class)))
                .thenThrow(
                        new ResourceNotFoundException("User not found")
                );


        mockMvc.perform(
                post("/api/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request))
        )
        .andExpect(status().isUnauthorized())
        .andExpect(
                jsonPath("$.error")
                        .value("Invalid email or password")
        );
    }


    // =========================================================
    // LOGIN - WRONG PASSWORD
    // =========================================================

    @Test
    void login_shouldReturn401_whenPasswordIsWrong() throws Exception {

        LoginRequest request = new LoginRequest();

        request.setEmailOrPhone("ali@example.com");
        request.setPassword("wrongpass");


        when(userService.login(any(LoginRequest.class)))
                .thenThrow(
                        new BadRequestException("Invalid password")
                );


        mockMvc.perform(
                post("/api/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request))
        )
        .andExpect(status().isUnauthorized())
        .andExpect(
                jsonPath("$.error")
                        .value("Invalid email or password")
        );
    }


    // =========================================================
    // REGISTER - DUPLICATE EMAIL
    // =========================================================

    @Test
    void register_shouldReturn409_whenEmailAlreadyExists()
            throws Exception {

        RegisterRequest request = new RegisterRequest();

        request.setFirstName("Ali");
        request.setLastName("Khan");
        request.setEmail("ali@example.com");
        request.setPhone(null);
        request.setPassword("password123");


        when(userService.register(any(RegisterRequest.class)))
                .thenThrow(
                        new ConflictException("Email already registered")
                );


        mockMvc.perform(
                post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request))
        )
        .andExpect(status().isConflict())
        .andExpect(
                jsonPath("$.error")
                        .value("Email already registered")
        );
    }
}