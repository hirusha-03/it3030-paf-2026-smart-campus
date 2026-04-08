package com.smart.backend.TicketMgmt.model;

import com.smart.backend.TicketMgmt.enums.Role;
import jakarta.persistence.*;
import lombok.Setter;
import java.time.LocalDateTime;  // ADD THIS

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(unique = true)
    private String email;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // ========== ADD THESE NEW FIELDS ==========
    @Setter
    @Column(length = 500)
    private String pictureUrl;

    @Setter
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Setter
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;
    // ========== END NEW FIELDS ==========

    // Constructors
    public User() {}

    public User(String name, String email, Role role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Existing Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    // ========== ADD THESE NEW GETTERS ==========
    public String getPictureUrl() {
        return pictureUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    // ========== END NEW GETTERS ==========

    // ========== ADD THESE LIFECYCLE METHODS ==========
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (role == null) {
            role = Role.USER;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    // ========== END LIFECYCLE METHODS ==========

}