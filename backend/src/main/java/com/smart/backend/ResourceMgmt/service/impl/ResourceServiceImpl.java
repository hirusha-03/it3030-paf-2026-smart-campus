package com.smart.backend.ResourceMgmt.service.impl;

import com.smart.backend.ResourceMgmt.dto.ResourceRequestDTO;
import com.smart.backend.ResourceMgmt.dto.ResourceResponseDTO;
import com.smart.backend.ResourceMgmt.model.Resource;
import com.smart.backend.TicketMgmt.model.User;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.exception.ResourceNotFoundException;
import com.smart.backend.ResourceMgmt.mapper.ResourceMapper;
import com.smart.backend.ResourceMgmt.repo.ResourceRepository;
import com.smart.backend.TicketMgmt.repo.UserRepository;  
import com.smart.backend.ResourceMgmt.service.ResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;  // Now uses TicketMgmt's UserRepository
    private final ResourceMapper resourceMapper;

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO requestDTO, String userEmail) {
        log.info("Creating new resource");
        
        Resource resource = resourceMapper.toEntity(requestDTO);
        resource.setCreatedBy(getUserByEmail(userEmail));
        if (resource.getStatus() == null) {
            resource.setStatus(ResourceStatus.ACTIVE);
        }
        
        Resource savedResource = resourceRepository.save(resource);
        log.info("Resource created with ID: {}", savedResource.getId());
        
        return resourceMapper.toDto(savedResource);
    }

    @Override
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO requestDTO, String userEmail) {
        log.info("Updating resource with ID: {}", id);
        
        Resource resource = getResourceByIdOrThrow(id);
        resourceMapper.updateEntity(resource, requestDTO);
        
        Resource updatedResource = resourceRepository.save(resource);
        log.info("Resource updated: {}", id);
        
        return resourceMapper.toDto(updatedResource);
    }

    @Override
    public ResourceResponseDTO getResourceById(Long id) {
        log.debug("Fetching resource with ID: {}", id);
        Resource resource = getResourceByIdOrThrow(id);
        return resourceMapper.toDto(resource);
    }

    @Override
    public Page<ResourceResponseDTO> getAllResources(Pageable pageable) {
        log.debug("Fetching all resources with pagination");
        return resourceRepository.findAll(pageable)
                .map(resourceMapper::toDto);
    }

    @Override
    public List<ResourceResponseDTO> searchResources(ResourceType type, String location, Integer minCapacity, ResourceStatus status) {
        log.debug("Searching resources by type: {}, location: {}, minCapacity: {}, status: {}", 
                  type, location, minCapacity, status);
        
        List<Resource> resources = resourceRepository.findAll();
        
        return resources.stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> location == null || r.getLocation().contains(location))
                .filter(r -> minCapacity == null || (r.getCapacity() != null && r.getCapacity() >= minCapacity))
                .filter(r -> status == null || r.getStatus() == status)
                .map(resourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteResource(Long id, String userEmail) {
        log.info("Deleting resource with ID: {}", id);
        
        Resource resource = getResourceByIdOrThrow(id);
        resourceRepository.delete(resource);
        
        log.info("Resource deleted: {}", id);
    }

    @Override
    public ResourceResponseDTO updateResourceStatus(Long id, ResourceStatus status, String userEmail) {
        log.info("Updating resource status to: {} for ID: {}", status, id);
        
        Resource resource = getResourceByIdOrThrow(id);
        resource.setStatus(status);
        
        Resource updatedResource = resourceRepository.save(resource);
        log.info("Resource status updated: {}", id);
        
        return resourceMapper.toDto(updatedResource);
    }

    @Override
    public List<ResourceResponseDTO> getResourcesByType(ResourceType type) {
        log.debug("Fetching resources by type: {}", type);
        return resourceRepository.findByType(type).stream()
                .map(resourceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceResponseDTO> getAvailableResources() {
        log.debug("Fetching available resources");
        return resourceRepository.findByStatus(ResourceStatus.ACTIVE).stream()
                .map(resourceMapper::toDto)
                .collect(Collectors.toList());
    }
    
    private Resource getResourceByIdOrThrow(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Resource not found with ID: {}", id);
                    return new ResourceNotFoundException("Resource not found with ID: " + id);
                });
    }
    
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(email.split("@")[0]);
                    newUser.setRole(com.smart.backend.TicketMgmt.enums.Role.USER);
                    return userRepository.save(newUser);
                });
    }
}