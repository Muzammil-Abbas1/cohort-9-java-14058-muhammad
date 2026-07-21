package backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContactRequest {

    private String firstName;
    private String lastName;
    private String title;

    private List<EmailDto> emails;
    private List<PhoneDto> phones;

    @Getter
    @Setter
    public static class EmailDto {

        private String email;
        private String label;

    }

    @Getter
    @Setter
    public static class PhoneDto {

        private String phone;
        private String label;

    }
}