package com.smart.backend.TicketMgmt.dto;

public class AttachmentDto {
    private Long id;
    private String filePath;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
}