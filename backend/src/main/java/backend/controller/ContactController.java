package backend.controller;

import backend.dto.ContactRequest;
import backend.entity.Contact;
import backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<?> createContact(@RequestBody ContactRequest request) {

        try {

            Contact saved = contactService.createContact(request);

            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }
    @GetMapping
public ResponseEntity<?> getContacts(Pageable pageable) {

    try {

        Page<Contact> contacts = contactService.getContacts(pageable);

        return ResponseEntity.ok(contacts);

    } catch (RuntimeException e) {

        return ResponseEntity.badRequest().body(e.getMessage());

    }
}
@GetMapping("/{id}")
public ResponseEntity<?> getContactById(@PathVariable Long id) {

    try {

        Contact contact = contactService.getContactById(id);

        return ResponseEntity.ok(contact);

    } catch (RuntimeException e) {

        return ResponseEntity.badRequest().body(e.getMessage());

    }
}
}