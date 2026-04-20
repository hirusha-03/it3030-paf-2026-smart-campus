package com.smart.backend.TicketMgmt.dto;

import com.smart.backend.TicketMgmt.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class TicketUpdateDto {
    @NotNull
    private TicketStatus status;
    private String resolutionNotes; // Optional: resolution notes from technician

    // Getters and setters
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}