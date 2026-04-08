package com.smart.backend.ResourceMgmt.controller;

import com.smart.backend.ResourceMgmt.dto.ApiResponse;
import com.smart.backend.ResourceMgmt.dto.ResourceRequestDTO;
import com.smart.backend.ResourceMgmt.dto.ResourceResponseDTO;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/resources")
@RequiredArgsConstructor
@Tag(name = "Resource Management", description = "Endpoints for managing facilities and assets")
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    @Operation(summary = "Create a new resource")
    public ResponseEntity<ApiResponse<ResourceResponseDTO>> createResource(
            @Valid @RequestBody ResourceRequestDTO requestDTO,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userEmail = jwt.getClaimAsString("email");
        ResourceResponseDTO created = resourceService.createResource(requestDTO, userEmail);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Resource created successfully", "/api/resources"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resource by ID")
    public ResponseEntity<ApiResponse<ResourceResponseDTO>> getResourceById(@PathVariable Long id) {
        ResourceResponseDTO resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(ApiResponse.success(resource, "Resource found", "/api/resources/" + id));
    }

    @GetMapping
    @Operation(summary = "Get all resources with pagination")
    public ResponseEntity<ApiResponse<Page<ResourceResponseDTO>>> getAllResources(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ResourceResponseDTO> resources = resourceService.getAllResources(pageable);
        
        return ResponseEntity.ok(ApiResponse.success(resources, "Resources retrieved", "/api/resources"));
    }

    @GetMapping("/search")
    @Operation(summary = "Search resources with filters")
    public ResponseEntity<ApiResponse<List<ResourceResponseDTO>>> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) ResourceStatus status) {
        
        List<ResourceResponseDTO> resources = resourceService.searchResources(type, location, minCapacity, status);
        return ResponseEntity.ok(ApiResponse.success(resources, "Search results", "/api/resources/search"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update resource")
    public ResponseEntity<ApiResponse<ResourceResponseDTO>> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequestDTO requestDTO,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userEmail = jwt.getClaimAsString("email");
        ResourceResponseDTO updated = resourceService.updateResource(id, requestDTO, userEmail);
        
        return ResponseEntity.ok(ApiResponse.success(updated, "Resource updated successfully", "/api/resources/" + id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete resource")
    public ResponseEntity<ApiResponse<Void>> deleteResource(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userEmail = jwt.getClaimAsString("email");
        resourceService.deleteResource(id, userEmail);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Resource deleted successfully", "/api/resources/" + id));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update resource status")
    public ResponseEntity<ApiResponse<ResourceResponseDTO>> updateResourceStatus(
            @PathVariable Long id,
            @RequestParam ResourceStatus status,
            @AuthenticationPrincipal Jwt jwt) {
        
        String userEmail = jwt.getClaimAsString("email");
        ResourceResponseDTO updated = resourceService.updateResourceStatus(id, status, userEmail);
        
        return ResponseEntity.ok(ApiResponse.success(updated, "Status updated successfully", "/api/resources/" + id + "/status"));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get resources by type")
    public ResponseEntity<ApiResponse<List<ResourceResponseDTO>>> getResourcesByType(@PathVariable ResourceType type) {
        List<ResourceResponseDTO> resources = resourceService.getResourcesByType(type);
        return ResponseEntity.ok(ApiResponse.success(resources, "Resources by type", "/api/resources/type/" + type));
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available resources")
    public ResponseEntity<ApiResponse<List<ResourceResponseDTO>>> getAvailableResources() {
        List<ResourceResponseDTO> resources = resourceService.getAvailableResources();
        return ResponseEntity.ok(ApiResponse.success(resources, "Available resources", "/api/resources/available"));
    }
}
