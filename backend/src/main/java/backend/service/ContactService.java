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
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    public Page<Contact> getContacts(Pageable pageable) {

    User user = getCurrentUser();

    return contactRepository.findByUserId(user.getId(), pageable);
}

public Contact getContactById(Long id) {

    User user = getCurrentUser();

    Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact not found"));

    if (!contact.getUser().getId().equals(user.getId())) {
        throw new RuntimeException("You are not authorized to view this contact");
    }

    return contact;
}
}