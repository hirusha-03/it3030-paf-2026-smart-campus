package com.smart.backend.TicketMgmt.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketRejectDto {
    @NotBlank
    private String rejectionReason;

    // Getters and setters
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
