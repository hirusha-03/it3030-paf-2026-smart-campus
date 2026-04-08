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
    public void saveAttachment(Long ticketId, String filePath) {
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        Attachment att = new Attachment();
        att.setFilePath(filePath);
        att.setTicket(ticket);
        attachmentRepo.save(att);
    }

    private AttachmentDto mapToDto(Attachment att) {
        AttachmentDto dto = new AttachmentDto();
        dto.setId(att.getId());
        dto.setFilePath(att.getFilePath());
        return dto;
    }
}