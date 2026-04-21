package com.smart.backend.ResourceMgmt.model;

import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import com.smart.backend.authentication.entity.Users;
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

    @Column(name = "name", nullable = false, length = 100, columnDefinition = "VARCHAR(100)")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, columnDefinition = "VARCHAR(50)")
    private ResourceType type;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "location", nullable = false, length = 255, columnDefinition = "VARCHAR(255)")
    private String location;

    @Column(name = "building", length = 100, columnDefinition = "VARCHAR(100)")
    private String building;
    
    @Column(name = "floor")
    private Integer floor;

    @Column(name = "available_from", columnDefinition = "TIME")
    private LocalTime availableFrom = LocalTime.of(8, 0);

    @Column(name = "available_to", columnDefinition = "TIME")
    private LocalTime availableTo = LocalTime.of(18, 0);

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, columnDefinition = "VARCHAR(20)")
    private ResourceStatus status = ResourceStatus.ACTIVE;

    @Column(name = "image_url", length = 500, columnDefinition = "VARCHAR(500)")
    private String imageUrl;
    
    @Column(name = "amenities", columnDefinition = "TEXT")
    private String amenities;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Users createdBy;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
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