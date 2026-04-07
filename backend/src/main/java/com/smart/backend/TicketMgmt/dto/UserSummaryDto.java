package com.smart.backend.TicketMgmt.dto;

import com.smart.backend.TicketMgmt.enums.Role;

public class UserSummaryDto {
    private Long id;
    private String name;
    private Role role;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}