package com.smart.backend.TicketMgmt.dto;

public class UserSummaryDto {
    private Long id;
    private String name;
    private String role;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}