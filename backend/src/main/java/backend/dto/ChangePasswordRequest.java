package backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    @NotBlank(message = "Email or phone is required")
    @Size(max = 100, message = "Email or phone cannot exceed 100 characters")
    private String emailOrPhone;

    @NotBlank(message = "Old password is required")
    @Size(min = 8, max = 100, message = "Old password must be between 8 and 100 characters")
    private String oldPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 100, message = "New password must be between 8 and 100 characters")
    private String newPassword;
}