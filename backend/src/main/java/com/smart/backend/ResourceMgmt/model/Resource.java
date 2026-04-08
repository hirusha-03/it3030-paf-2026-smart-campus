package com.smart.backend.ResourceMgmt.model;

import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import com.smart.backend.TicketMgmt.model.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "resources", indexes = {
    @Index(name = "idx_type", columnList = "type"),
    @Index(name = "idx_location", columnList = "location"),
    @Index(name = "idx_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    private Integer capacity;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(length = 100)
    private String building;
    
    private Integer floor;

    @Column(columnDefinition = "TIME")
    private LocalTime availableFrom = LocalTime.of(8, 0);

    @Column(columnDefinition = "TIME")
    private LocalTime availableTo = LocalTime.of(18, 0);

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ACTIVE'")
    private ResourceStatus status = ResourceStatus.ACTIVE;

    @Column(length = 500)
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String amenities;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (availableFrom == null) {
            availableFrom = LocalTime.of(8, 0);
        }
        if (availableTo == null) {
            availableTo = LocalTime.of(18, 0);
        }
        if (status == null) {
            status = ResourceStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}