package backend.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class EntityTimestampTest {

    @Test
    void contact_onCreate_shouldSetCreatedAt() {
        Contact contact = new Contact();

        contact.onCreate();

        assertNotNull(contact.getCreatedAt());
    }

    @Test
    void user_onCreate_shouldSetCreatedAt() {
        User user = new User();

        user.onCreate();

        assertNotNull(user.getCreatedAt());
    }
}