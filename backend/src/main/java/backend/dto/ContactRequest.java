package backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContactRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @Valid
    private List<EmailDto> emails;

    @Valid
    private List<PhoneDto> phones;

    @Getter
    @Setter
    public static class EmailDto {

        @NotBlank(message = "Email is required")
        @Email(message = "Please enter a valid email address")
        private String email;

        @NotBlank(message = "Email label is required")
        @Size(max = 30, message = "Email label cannot exceed 30 characters")
        private String label;
    }

    @Getter
    @Setter
    public static class PhoneDto {

        @NotBlank(message = "Phone number is required")
        @Size(max = 20, message = "Phone number cannot exceed 20 characters")
        private String phone;

        @NotBlank(message = "Phone label is required")
        @Size(max = 30, message = "Phone label cannot exceed 30 characters")
        private String label;
    }
}