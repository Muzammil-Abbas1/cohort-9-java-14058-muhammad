package backend.controller;

import backend.dto.ContactRequest;
import backend.entity.Contact;
import backend.service.ContactService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ContactControllerTest {

    private ContactService contactService;
    private ContactController contactController;

    @BeforeEach
    void setUp() {
        contactService = mock(ContactService.class);
        contactController = new ContactController(contactService);
    }

    @Test
    void createContact_shouldReturnSavedContact() {
        ContactRequest request = new ContactRequest();
        Contact savedContact = new Contact();

        when(contactService.createContact(request))
                .thenReturn(savedContact);

        ResponseEntity<Contact> response =
                contactController.createContact(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(savedContact, response.getBody());

        verify(contactService).createContact(request);
    }

    @Test
    void getContacts_shouldReturnContacts() {
        Pageable pageable = Pageable.unpaged();

        Contact contact = new Contact();
        Page<Contact> page =
                new PageImpl<>(List.of(contact));

        when(contactService.getContacts(pageable))
                .thenReturn(page);

        ResponseEntity<Page<Contact>> response =
                contactController.getContacts(pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());

        verify(contactService).getContacts(pageable);
    }

    @Test
    void searchContacts_shouldReturnMatchingContacts() {
        String name = "Ali";
        Pageable pageable = Pageable.unpaged();

        Contact contact = new Contact();
        Page<Contact> page =
                new PageImpl<>(List.of(contact));

        when(contactService.searchContacts(name, pageable))
                .thenReturn(page);

        ResponseEntity<Page<Contact>> response =
                contactController.searchContacts(name, pageable);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(page, response.getBody());

        verify(contactService)
                .searchContacts(name, pageable);
    }

    @Test
    void getContactById_shouldReturnContact() {
        Long id = 1L;
        Contact contact = new Contact();

        when(contactService.getContactById(id))
                .thenReturn(contact);

        ResponseEntity<Contact> response =
                contactController.getContactById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(contact, response.getBody());

        verify(contactService).getContactById(id);
    }

    @Test
    void updateContact_shouldReturnUpdatedContact() {
        Long id = 1L;
        ContactRequest request = new ContactRequest();
        Contact updatedContact = new Contact();

        when(contactService.updateContact(id, request))
                .thenReturn(updatedContact);

        ResponseEntity<Contact> response =
                contactController.updateContact(id, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedContact, response.getBody());

        verify(contactService)
                .updateContact(id, request);
    }

    @Test
    void deleteContact_shouldReturnSuccessMessage() {
        Long id = 1L;

        doNothing()
                .when(contactService)
                .deleteContact(id);

        ResponseEntity<String> response =
                contactController.deleteContact(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(
                "Contact deleted successfully",
                response.getBody()
        );

        verify(contactService).deleteContact(id);
    }
}