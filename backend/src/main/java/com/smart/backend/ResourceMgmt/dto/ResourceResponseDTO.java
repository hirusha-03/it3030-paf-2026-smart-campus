package com.smart.backend.ResourceMgmt.dto;

import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class ResourceResponseDTO {
    private Long id;
    private String name;
    private String description;
    private ResourceType type;
    private String typeDisplayName;
    private Integer capacity;
    private String location;
    private String building;
    private Integer floor;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String imageUrl;
    private String amenities;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}