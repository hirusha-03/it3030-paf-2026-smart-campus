package com.smart.backend.TicketMgmt.dto;

import jakarta.validation.constraints.NotNull;

public class TicketAssignDto {
    @NotNull
    private Long assignedToId;

    // Getters and setters
    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
}