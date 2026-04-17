package com.smart.backend.TicketMgmt.dto;

import com.smart.backend.TicketMgmt.enums.Priority;
import com.smart.backend.TicketMgmt.enums.ContactMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class TicketCreateDto {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotNull
    private Priority priority;
    private String category;
    @NotNull
    private ContactMethod contactMethod;
    @NotBlank
    private String contactDetails; // Phone or email
    private List<String> attachmentFilePaths; // List of file paths/URLs from Supabase
    private Long relatedBookingId; // Optional: ID of related booking
    private Long relatedResourceId; // Optional: ID of related resource

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public ContactMethod getContactMethod() { return contactMethod; }
    public void setContactMethod(ContactMethod contactMethod) { this.contactMethod = contactMethod; }
    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }
    public List<String> getAttachmentFilePaths() { return attachmentFilePaths; }
    public void setAttachmentFilePaths(List<String> attachmentFilePaths) { this.attachmentFilePaths = attachmentFilePaths; }
    public Long getRelatedBookingId() { return relatedBookingId; }
    public void setRelatedBookingId(Long relatedBookingId) { this.relatedBookingId = relatedBookingId; }
    public Long getRelatedResourceId() { return relatedResourceId; }
    public void setRelatedResourceId(Long relatedResourceId) { this.relatedResourceId = relatedResourceId; }
}