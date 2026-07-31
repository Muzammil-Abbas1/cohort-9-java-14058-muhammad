package backend.service;

import backend.entity.Contact;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.exception.UnauthorizedException;
import backend.repository.ContactRepository;
import backend.repository.UserRepository;
import backend.security.AuthUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthUtil authUtil;

    @InjectMocks
    private ContactService contactService;

    private User currentUser;

    @BeforeEach
    void setUp() {

        currentUser = new User();
        currentUser.setId(1L);
        currentUser.setEmail("ali@example.com");

        when(authUtil.getCurrentUserIdentifier())
                .thenReturn("ali@example.com");

        when(userRepository.findByEmail("ali@example.com"))
                .thenReturn(Optional.of(currentUser));
    }

    @Test
    void getContactById_shouldReturnContact_whenUserOwnsIt() {

        Contact contact = new Contact();
        contact.setId(5L);
        contact.setUser(currentUser);

        when(contactRepository.findById(5L))
                .thenReturn(Optional.of(contact));

        Contact result = contactService.getContactById(5L);

        assertNotNull(result);
        assertEquals(5L, result.getId());
    }

    @Test
    void getContactById_shouldThrowNotFound_whenContactDoesNotExist() {

        when(contactRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> contactService.getContactById(99L)
        );
    }

    @Test
    void getContactById_shouldThrowUnauthorized_whenContactBelongsToAnotherUser() {

        User anotherUser = new User();
        anotherUser.setId(2L);

        Contact contact = new Contact();
        contact.setId(5L);
        contact.setUser(anotherUser);

        when(contactRepository.findById(5L))
                .thenReturn(Optional.of(contact));

        assertThrows(
                UnauthorizedException.class,
                () -> contactService.getContactById(5L)
        );
    }

    @Test
    void deleteContact_shouldCallRepositoryDelete_whenUserOwnsContact() {

        Contact contact = new Contact();
        contact.setId(5L);
        contact.setUser(currentUser);

        when(contactRepository.findById(5L))
                .thenReturn(Optional.of(contact));

        contactService.deleteContact(5L);

        verify(contactRepository).delete(contact);
    }
}