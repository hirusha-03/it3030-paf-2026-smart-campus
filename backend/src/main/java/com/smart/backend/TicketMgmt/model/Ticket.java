package com.smart.backend.TicketMgmt.model;

import com.smart.backend.TicketMgmt.enums.Priority;
import com.smart.backend.TicketMgmt.enums.TicketStatus;
import com.smart.backend.TicketMgmt.enums.ContactMethod;
import com.smart.backend.authentication.entity.Users;
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
    private Users createdBy;

    // Assigned technician
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private Users assignedTo;

    // Optional relations (no FK constraints)
    private Long relatedBookingId;
    private Long relatedResourceId;

    // Category and contact info
    private String category; // e.g., "Maintenance", "Technical", "General"
    @Enumerated(EnumType.STRING)
    private ContactMethod contactMethod; // EMAIL, PHONE, IN_PERSON
    private String contactDetails; // Phone number or email

    // Resolution tracking
    @Column(columnDefinition = "TEXT")
    private String resolutionNotes; // Notes from technician
    
    @Column(columnDefinition = "TEXT")
    private String rejectionReason; // Reason if ticket is rejected

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // Service-level timers
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;

    // Constructors
    public Ticket() {}

    public Ticket(String title, String description, Priority priority, Users user) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.createdBy = user;
    }

    public Ticket(String title, String description, Priority priority, Users user, Long relatedBookingId, Long relatedResourceId) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.createdBy = user;
        this.relatedBookingId = relatedBookingId;
        this.relatedResourceId = relatedResourceId;
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

    public Users getCreatedBy() { return createdBy; }
    public void setCreatedBy(Users createdBy) { this.createdBy = createdBy; }

    public Users getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Users assignedTo) { this.assignedTo = assignedTo; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getFirstResponseAt() { return firstResponseAt; }
    public void setFirstResponseAt(LocalDateTime firstResponseAt) { this.firstResponseAt = firstResponseAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public Long getRelatedBookingId() { return relatedBookingId; }
    public void setRelatedBookingId(Long relatedBookingId) { this.relatedBookingId = relatedBookingId; }

    public Long getRelatedResourceId() { return relatedResourceId; }
    public void setRelatedResourceId(Long relatedResourceId) { this.relatedResourceId = relatedResourceId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public ContactMethod getContactMethod() { return contactMethod; }
    public void setContactMethod(ContactMethod contactMethod) { this.contactMethod = contactMethod; }

    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}