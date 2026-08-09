package backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contacts")
@Getter
@Setter
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "contact",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ContactEmail> emails = new ArrayList<>();

    @OneToMany(mappedBy = "contact",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ContactPhone> phones = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now(ZoneOffset.UTC);
    }
}
