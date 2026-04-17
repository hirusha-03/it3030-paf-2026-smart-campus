package com.smart.backend.ResourceMgmt.repo;

import com.smart.backend.ResourceMgmt.model.Resource;
import com.smart.backend.ResourceMgmt.enums.ResourceType;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    
    // Basic finder methods
    List<Resource> findByType(ResourceType type);
    
    List<Resource> findByStatus(ResourceStatus status);
    
    List<Resource> findByLocationContainingIgnoreCase(String location);
    
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
    
    // Combined search methods
    List<Resource> findByTypeAndLocationContainingIgnoreCase(ResourceType type, String location);
    
    List<Resource> findByTypeAndCapacityGreaterThanEqual(ResourceType type, Integer minCapacity);
    
    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);
    
    List<Resource> findByLocationContainingIgnoreCaseAndCapacityGreaterThanEqual(String location, Integer minCapacity);
    
    List<Resource> findByLocationContainingIgnoreCaseAndStatus(String location, ResourceStatus status);
    
    List<Resource> findByCapacityGreaterThanEqualAndStatus(Integer minCapacity, ResourceStatus status);
    
    List<Resource> findByTypeAndLocationContainingIgnoreCaseAndCapacityGreaterThanEqual(ResourceType type, String location, Integer minCapacity);
    
    List<Resource> findByTypeAndLocationContainingIgnoreCaseAndStatus(ResourceType type, String location, ResourceStatus status);
    
    List<Resource> findByTypeAndCapacityGreaterThanEqualAndStatus(ResourceType type, Integer minCapacity, ResourceStatus status);
    
    List<Resource> findByLocationContainingIgnoreCaseAndCapacityGreaterThanEqualAndStatus(String location, Integer minCapacity, ResourceStatus status);
    
    List<Resource> findByTypeAndLocationContainingIgnoreCaseAndCapacityGreaterThanEqualAndStatus(ResourceType type, String location, Integer minCapacity, ResourceStatus status);
}