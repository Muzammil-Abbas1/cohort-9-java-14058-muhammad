package backend.controller;

import backend.dto.ContactRequest;
import backend.entity.Contact;
import backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // ================= CREATE CONTACT =================

    @PostMapping
    public ResponseEntity<Contact> createContact(
            @Valid @RequestBody ContactRequest request) {

        Contact saved = contactService.createContact(request);

        return ResponseEntity.ok(saved);
    }

    // ================= GET ALL CONTACTS =================

    @GetMapping
    public ResponseEntity<Page<Contact>> getContacts(Pageable pageable) {

        Page<Contact> contacts = contactService.getContacts(pageable);

        return ResponseEntity.ok(contacts);
    }

    // ================= SEARCH CONTACTS =================

    @GetMapping("/search")
    public ResponseEntity<Page<Contact>> searchContacts(
            @RequestParam String name,
            Pageable pageable) {

        Page<Contact> contacts =
                contactService.searchContacts(name, pageable);

        return ResponseEntity.ok(contacts);
    }

    // ================= GET CONTACT BY ID =================

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContactById(
            @PathVariable Long id) {

        Contact contact = contactService.getContactById(id);

        return ResponseEntity.ok(contact);
    }

    // ================= UPDATE CONTACT =================

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request) {

        Contact updated =
                contactService.updateContact(id, request);

        return ResponseEntity.ok(updated);
    }

    // ================= DELETE CONTACT =================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContact(
            @PathVariable Long id) {

        contactService.deleteContact(id);

        return ResponseEntity.ok("Contact deleted successfully");
    }
}