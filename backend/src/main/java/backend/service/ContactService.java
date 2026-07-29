package backend.service;

import backend.dto.ContactRequest;
import backend.entity.Contact;
import backend.entity.ContactEmail;
import backend.entity.ContactPhone;
import backend.entity.User;
import backend.repository.ContactRepository;
import backend.repository.UserRepository;
import backend.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final AuthUtil authUtil;

    private User getCurrentUser() {

        String identifier = authUtil.getCurrentUserIdentifier();

        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));
    }

    // ================= CREATE CONTACT =================

    public Contact createContact(ContactRequest request) {

        User user = getCurrentUser();

        Contact contact = new Contact();
        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setTitle(request.getTitle());
        contact.setUser(user);

        if (request.getEmails() != null) {

            request.getEmails().forEach(e -> {

                ContactEmail email = new ContactEmail();
                email.setEmail(e.getEmail());
                email.setLabel(e.getLabel());
                email.setContact(contact);

                contact.getEmails().add(email);
            });
        }

        if (request.getPhones() != null) {

            request.getPhones().forEach(p -> {

                ContactPhone phone = new ContactPhone();
                phone.setPhone(p.getPhone());
                phone.setLabel(p.getLabel());
                phone.setContact(contact);

                contact.getPhones().add(phone);
            });
        }

        Contact saved = contactRepository.save(contact);

        logger.info("Contact created: {} {} by user {}",
                saved.getFirstName(),
                saved.getLastName(),
                user.getEmail());

        return saved;
    }

    // ================= GET ALL CONTACTS =================

    public Page<Contact> getContacts(Pageable pageable) {

        User user = getCurrentUser();

        return contactRepository.findByUserId(user.getId(), pageable);
    }

    // ================= GET CONTACT BY ID =================

    public Contact getContactById(Long id) {

        User user = getCurrentUser();

        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to view this contact");
        }

        return contact;
    }

    // ================= SEARCH CONTACTS =================

    public Page<Contact> searchContacts(String name, Pageable pageable) {

        User user = getCurrentUser();

        return contactRepository.searchByName(user.getId(), name, pageable);
    }

    // ================= UPDATE CONTACT =================

    public Contact updateContact(Long id, ContactRequest request) {

        Contact contact = getContactById(id);

        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setTitle(request.getTitle());

        contact.getEmails().clear();
        contact.getPhones().clear();

        if (request.getEmails() != null) {

            request.getEmails().forEach(e -> {

                ContactEmail email = new ContactEmail();
                email.setEmail(e.getEmail());
                email.setLabel(e.getLabel());
                email.setContact(contact);

                contact.getEmails().add(email);
            });
        }

        if (request.getPhones() != null) {

            request.getPhones().forEach(p -> {

                ContactPhone phone = new ContactPhone();
                phone.setPhone(p.getPhone());
                phone.setLabel(p.getLabel());
                phone.setContact(contact);

                contact.getPhones().add(phone);
            });
        }

        Contact updated = contactRepository.save(contact);

        logger.info("Contact updated: id={} by user={}",
                id,
                getCurrentUser().getEmail());

        return updated;
    }

    // ================= DELETE CONTACT =================

    public void deleteContact(Long id) {

        Contact contact = getContactById(id);

        contactRepository.delete(contact);

        logger.info("Contact deleted: id={} by user={}",
                id,
                getCurrentUser().getEmail());
    }
}