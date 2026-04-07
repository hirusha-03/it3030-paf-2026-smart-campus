package com.smart.backend.TicketMgmt.model;


import com.smart.backend.TicketMgmt.enums.Priority;
import com.smart.backend.TicketMgmt.enums.TicketStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic info
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    // Status
    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    // Priority
    @Enumerated(EnumType.STRING)
    private Priority priority;

    // Who created ticket
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Assigned technician
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public Ticket() {}

    public Ticket(String title, String description, Priority priority, User user) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.createdBy = user;
    }

    // Auto set values
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = TicketStatus.OPEN;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}