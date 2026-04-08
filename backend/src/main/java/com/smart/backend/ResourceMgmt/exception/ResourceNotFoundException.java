package com.smart.backend.ResourceMgmt.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(Long id) {
        super("Resource not found with ID: " + id);
    }
}
