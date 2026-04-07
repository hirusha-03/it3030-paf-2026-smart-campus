package com.smart.backend.TicketMgmt.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentCreateDto {
    @NotBlank
    private String message;

    // Getters and setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}