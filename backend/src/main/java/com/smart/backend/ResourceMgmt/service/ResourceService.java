package com.smart.backend.ResourceMgmt.service;

import com.smart.backend.ResourceMgmt.dto.ResourceRequestDTO;
import com.smart.backend.ResourceMgmt.dto.ResourceResponseDTO;
import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ResourceService {
    ResourceResponseDTO createResource(ResourceRequestDTO requestDTO, String userEmail);
    ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO, String userEmail);
    ResourceResponseDTO getResourceById(Long id);
    Page<ResourceResponseDTO> getAllResources(Pageable pageable);
    List<ResourceResponseDTO> searchResources(ResourceType type, String location, Integer minCapacity, ResourceStatus status);
    void deleteResource(Long id, String userEmail);
    ResourceResponseDTO updateResourceStatus(Long id, ResourceStatus status, String userEmail);
    List<ResourceResponseDTO> getResourcesByType(ResourceType type);
    List<ResourceResponseDTO> getAvailableResources();
}
