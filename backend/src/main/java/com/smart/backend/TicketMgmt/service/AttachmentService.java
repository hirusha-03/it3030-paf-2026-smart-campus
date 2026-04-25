package com.smart.backend.TicketMgmt.service;

import com.smart.backend.TicketMgmt.dto.AttachmentDto;
import com.smart.backend.TicketMgmt.model.Attachment;
import com.smart.backend.TicketMgmt.model.Ticket;
import com.smart.backend.TicketMgmt.repo.AttachmentRepository;
import com.smart.backend.TicketMgmt.repo.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttachmentService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MAX_ATTACHMENTS = 3;
    private static final String[] ALLOWED_TYPES = {"image/png", "image/jpeg", "image/jpg"};

    @Autowired
    private AttachmentRepository attachmentRepo;
    @Autowired
    private TicketRepository ticketRepo;

    public List<AttachmentDto> getAttachmentsByTicket(Long ticketId) {
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        List<Attachment> attachments = attachmentRepo.findByTicket(ticket);
        return attachments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Add method to save attachment (integrate with Supabase upload)
    public Attachment saveAttachment(Long ticketId, String filePath) {
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        
        // Validate attachment count
        List<Attachment> existingAttachments = attachmentRepo.findByTicket(ticket);
        if (existingAttachments.size() >= MAX_ATTACHMENTS) {
            throw new IllegalArgumentException("Maximum " + MAX_ATTACHMENTS + " attachments allowed per ticket");
        }
        
        Attachment att = new Attachment();
        att.setFilePath(filePath);
        att.setTicket(ticket);
        return attachmentRepo.save(att);
    }

    public String getAttachmentFilePath(Long attachmentId) {
        Attachment att = attachmentRepo.findById(attachmentId).orElse(null);
        return att == null ? null : att.getFilePath();
    }

    private AttachmentDto mapToDto(Attachment att) {
        AttachmentDto dto = new AttachmentDto();
        dto.setId(att.getId());
        dto.setFilePath(att.getFilePath());
        // derive a readable filename from stored path
        if (att.getFilePath() != null) {
            try {
                java.nio.file.Path p = java.nio.file.Paths.get(att.getFilePath());
                dto.setFileName(p.getFileName().toString());
            } catch (Exception e) {
                // fallback to naive split
                String fp = att.getFilePath();
                int idx = Math.max(fp.lastIndexOf('/'), fp.lastIndexOf('\\'));
                dto.setFileName(idx >= 0 ? fp.substring(idx + 1) : fp);
            }
        }
        return dto;
    }
}