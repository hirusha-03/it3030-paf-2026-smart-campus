package com.smart.backend.TicketMgmt.dto;

import com.smart.backend.TicketMgmt.enums.Priority;
import com.smart.backend.TicketMgmt.enums.TicketStatus;
import java.time.LocalDateTime;
import java.util.List;

public class TicketResponseDto {
    private Long id;
    private String title;
    private String description;
    private TicketStatus status;
    private Priority priority;
    private UserSummaryDto createdBy;
    private UserSummaryDto assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentResponseDto> comments;
    private List<AttachmentDto> attachments;
    private Long relatedBookingId;
    private Long relatedResourceId;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public UserSummaryDto getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserSummaryDto createdBy) { this.createdBy = createdBy; }
    public UserSummaryDto getAssignedTo() { return assignedTo; }
    public void setAssignedTo(UserSummaryDto assignedTo) { this.assignedTo = assignedTo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<CommentResponseDto> getComments() { return comments; }
    public void setComments(List<CommentResponseDto> comments) { this.comments = comments; }
    public List<AttachmentDto> getAttachments() { return attachments; }
    public void setAttachments(List<AttachmentDto> attachments) { this.attachments = attachments; }
    public Long getRelatedBookingId() { return relatedBookingId; }
    public void setRelatedBookingId(Long relatedBookingId) { this.relatedBookingId = relatedBookingId; }
    public Long getRelatedResourceId() { return relatedResourceId; }
    public void setRelatedResourceId(Long relatedResourceId) { this.relatedResourceId = relatedResourceId; }
}