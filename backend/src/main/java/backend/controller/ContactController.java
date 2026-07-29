package backend.controller;

import backend.dto.ContactRequest;
import backend.entity.Contact;
import backend.service.ContactService;
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
    public ResponseEntity<?> createContact(@RequestBody ContactRequest request) {

        try {

            Contact saved = contactService.createContact(request);

            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    // ================= GET ALL CONTACTS =================

    @GetMapping
    public ResponseEntity<?> getContacts(Pageable pageable) {

        try {

            Page<Contact> contacts = contactService.getContacts(pageable);

            return ResponseEntity.ok(contacts);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    // ================= SEARCH CONTACTS =================

    @GetMapping("/search")
    public ResponseEntity<?> searchContacts(
            @RequestParam String name,
            Pageable pageable) {

        try {

            Page<Contact> contacts = contactService.searchContacts(name, pageable);

            return ResponseEntity.ok(contacts);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    // ================= GET CONTACT BY ID =================

    @GetMapping("/{id}")
    public ResponseEntity<?> getContactById(@PathVariable Long id) {

        try {

            Contact contact = contactService.getContactById(id);

            return ResponseEntity.ok(contact);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    // ================= UPDATE CONTACT =================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(
            @PathVariable Long id,
            @RequestBody ContactRequest request) {

        try {

            Contact updated = contactService.updateContact(id, request);

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

    // ================= DELETE CONTACT =================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {

        try {

            contactService.deleteContact(id);

            return ResponseEntity.ok("Contact deleted successfully");

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }
}