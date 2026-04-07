package com.smart.backend.TicketMgmt.dto;

import com.smart.backend.TicketMgmt.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class TicketUpdateDto {
    @NotNull
    private TicketStatus status;

    // Getters and setters
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
}