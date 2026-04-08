package com.smart.backend.ResourceMgmt.service;

import com.smart.backend.ResourceMgmt.dto.ResourceRequestDTO;
import com.smart.backend.ResourceMgmt.dto.ResourceResponseDTO;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.exception.ResourceNotFoundException;
import com.smart.backend.ResourceMgmt.model.Resource;
import com.smart.backend.ResourceMgmt.repo.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceResponseDTO createResource(ResourceRequestDTO requestDTO) {
        Resource resource = new Resource();
        applyRequestToResource(resource, requestDTO);
        if (resource.getStatus() == null) {
            resource.setStatus(ResourceStatus.ACTIVE);
        }
        Resource saved = resourceRepository.save(resource);
        return toDto(saved);
    }

    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO) {
        Resource resource = findById(id);
        applyRequestToResource(resource, requestDTO);
        Resource updated = resourceRepository.save(resource);
        return toDto(updated);
    }

    public ResourceResponseDTO getResourceById(Long id) {
        return toDto(findById(id));
    }

    public Page<ResourceResponseDTO> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable).map(this::toDto);
    }

    public List<ResourceResponseDTO> searchResources(ResourceType type, String location, Integer minCapacity, ResourceStatus status) {
        return resourceRepository.searchResources(type, location, minCapacity, status).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void deleteResource(Long id) {
        Resource resource = findById(id);
        resourceRepository.delete(resource);
    }

    public ResourceResponseDTO updateResourceStatus(Long id, ResourceStatus status) {
        Resource resource = findById(id);
        resource.setStatus(status);
        return toDto(resourceRepository.save(resource));
    }

    public List<ResourceResponseDTO> getResourcesByType(ResourceType type) {
        return resourceRepository.findByType(type).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ResourceResponseDTO> getAvailableResources() {
        return resourceRepository.findByStatus(ResourceStatus.ACTIVE).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private Resource findById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }

    private void applyRequestToResource(Resource resource, ResourceRequestDTO requestDTO) {
        resource.setName(requestDTO.getName());
        resource.setDescription(requestDTO.getDescription());
        resource.setType(requestDTO.getType());
        resource.setCapacity(requestDTO.getCapacity());
        resource.setLocation(requestDTO.getLocation());
        resource.setBuilding(requestDTO.getBuilding());
        resource.setFloor(requestDTO.getFloor());
        resource.setAvailableFrom(requestDTO.getAvailableFrom());
        resource.setAvailableTo(requestDTO.getAvailableTo());
        if (requestDTO.getStatus() != null) {
            resource.setStatus(requestDTO.getStatus());
        }
        resource.setImageUrl(requestDTO.getImageUrl());
        resource.setAmenities(requestDTO.getAmenities());
    }

    private ResourceResponseDTO toDto(Resource resource) {
        if (resource == null) {
            return null;
        }
        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .name(resource.getName())
                .description(resource.getDescription())
                .type(resource.getType())
                .typeDisplayName(resource.getType() != null ? resource.getType().name() : null)
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .building(resource.getBuilding())
                .floor(resource.getFloor())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .status(resource.getStatus())
                .imageUrl(resource.getImageUrl())
                .amenities(resource.getAmenities())
                .createdBy(resource.getCreatedBy() != null ? resource.getCreatedBy().getEmail() : null)
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
