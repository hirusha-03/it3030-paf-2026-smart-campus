package com.smart.backend.TicketMgmt.dto;

import com.smart.backend.TicketMgmt.enums.Priority;
import com.smart.backend.TicketMgmt.enums.TicketStatus;
import com.smart.backend.TicketMgmt.enums.ContactMethod;
import java.time.LocalDateTime;
import java.util.List;

public class TicketResponseDto {
    private Long id;
    private String title;
    private String description;
    private TicketStatus status;
    private Priority priority;
    private String category;
    private ContactMethod contactMethod;
    private String contactDetails;
    private UserSummaryDto createdBy;
    private UserSummaryDto assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String resolutionNotes;
    private String rejectionReason;
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
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public ContactMethod getContactMethod() { return contactMethod; }
    public void setContactMethod(ContactMethod contactMethod) { this.contactMethod = contactMethod; }
    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }
    public UserSummaryDto getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserSummaryDto createdBy) { this.createdBy = createdBy; }
    public UserSummaryDto getAssignedTo() { return assignedTo; }
    public void setAssignedTo(UserSummaryDto assignedTo) { this.assignedTo = assignedTo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public List<CommentResponseDto> getComments() { return comments; }
    public void setComments(List<CommentResponseDto> comments) { this.comments = comments; }
    public List<AttachmentDto> getAttachments() { return attachments; }
    public void setAttachments(List<AttachmentDto> attachments) { this.attachments = attachments; }
    public Long getRelatedBookingId() { return relatedBookingId; }
    public void setRelatedBookingId(Long relatedBookingId) { this.relatedBookingId = relatedBookingId; }
    public Long getRelatedResourceId() { return relatedResourceId; }
    public void setRelatedResourceId(Long relatedResourceId) { this.relatedResourceId = relatedResourceId; }
}