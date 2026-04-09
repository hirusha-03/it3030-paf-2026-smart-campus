package com.smart.backend.ResourceMgmt.controller;

import com.smart.backend.ResourceMgmt.dto.ResourceRequestDTO;
import com.smart.backend.ResourceMgmt.dto.ResourceResponseDTO;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        ResourceResponseDTO created = resourceService.createResource(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        ResourceResponseDTO resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @GetMapping
    public ResponseEntity<Page<ResourceResponseDTO>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ResourceResponseDTO> resources = resourceService.getAllResources(pageable);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponseDTO>> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) ResourceStatus status) {
        List<ResourceResponseDTO> resources = resourceService.searchResources(type, location, minCapacity, status);
        return ResponseEntity.ok(resources);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO requestDTO) {
        ResourceResponseDTO updated = resourceService.updateResource(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ResourceResponseDTO> updateResourceStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status) {
        ResourceResponseDTO updated = resourceService.updateResourceStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ResourceResponseDTO>> getResourcesByType(@PathVariable ResourceType type) {
        List<ResourceResponseDTO> resources = resourceService.getResourcesByType(type);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/available")
    public ResponseEntity<List<ResourceResponseDTO>> getAvailableResources() {
        List<ResourceResponseDTO> resources = resourceService.getAvailableResources();
        return ResponseEntity.ok(resources);
    }
}
