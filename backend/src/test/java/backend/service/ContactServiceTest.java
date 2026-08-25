package backend.service;

import backend.entity.Contact;
import backend.entity.User;
import backend.exception.ResourceNotFoundException;
import backend.exception.UnauthorizedException;
import backend.repository.ContactRepository;
import backend.security.AuthUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

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

        when(authUtil.getCurrentUser())
                .thenReturn(currentUser);
    }

    @Test
    void getContacts_shouldUseAllContacts_whenFavoritesOnlyIsFalse() {

        Pageable pageable = Pageable.unpaged();
        Page<Contact> page = new PageImpl<>(List.of(new Contact()));

        when(contactRepository.findByUserId(1L, pageable))
                .thenReturn(page);

        Page<Contact> result = contactService.getContacts(pageable, false);

        assertEquals(page, result);
        verify(contactRepository, never()).findByUserIdAndFavoriteTrue(any(), any());
    }

    @Test
    void getContacts_shouldUseFavoritesOnly_whenFavoritesOnlyIsTrue() {

        Pageable pageable = Pageable.unpaged();
        Page<Contact> page = new PageImpl<>(List.of(new Contact()));

        when(contactRepository.findByUserIdAndFavoriteTrue(1L, pageable))
                .thenReturn(page);

        Page<Contact> result = contactService.getContacts(pageable, true);

        assertEquals(page, result);
        verify(contactRepository, never()).findByUserId(any(), any());
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
    void toggleFavorite_shouldFlipFavoriteFlag_whenUserOwnsContact() {

        Contact contact = new Contact();
        contact.setId(5L);
        contact.setUser(currentUser);
        contact.setFavorite(false);

        when(contactRepository.findById(5L))
                .thenReturn(Optional.of(contact));

        when(contactRepository.save(any(Contact.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Contact result = contactService.toggleFavorite(5L);

        assertTrue(result.isFavorite());
        verify(contactRepository).save(contact);
    }

    @Test
    void toggleFavorite_shouldThrowUnauthorized_whenContactBelongsToAnotherUser() {

        User anotherUser = new User();
        anotherUser.setId(2L);

        Contact contact = new Contact();
        contact.setId(5L);
        contact.setUser(anotherUser);

        when(contactRepository.findById(5L))
                .thenReturn(Optional.of(contact));

        assertThrows(
                UnauthorizedException.class,
                () -> contactService.toggleFavorite(5L)
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

        verify(contactRepository, times(1)).delete(contact);
    }
}