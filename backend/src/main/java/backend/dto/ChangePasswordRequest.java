package backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {

    private String emailOrPhone;

    private String oldPassword;

    private String newPassword;
}