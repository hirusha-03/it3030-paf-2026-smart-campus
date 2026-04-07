package com.smart.backend.TicketMgmt.service;

import com.smart.backend.TicketMgmt.dto.*;
import com.smart.backend.TicketMgmt.enums.Role;
import com.smart.backend.TicketMgmt.model.*;
import com.smart.backend.TicketMgmt.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private CommentRepository commentRepo;
    @Autowired
    private AttachmentRepository attachmentRepo;

    public TicketResponseDto createTicket(TicketCreateDto dto, Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        Ticket ticket = new Ticket(dto.getTitle(), dto.getDescription(), dto.getPriority(), user);
        ticket = ticketRepo.save(ticket);
        // Handle attachments if provided
        if (dto.getAttachmentFilePaths() != null) {
            for (String path : dto.getAttachmentFilePaths()) {
                Attachment att = new Attachment();
                att.setFilePath(path);
                att.setTicket(ticket);
                attachmentRepo.save(att);
            }
        }
        return mapToResponse(ticket);
    }

    public List<TicketResponseDto> getTicketsForUser(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<Ticket> tickets;
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.TECHNICIAN) {
            tickets = ticketRepo.findAll();
        } else {
            tickets = ticketRepo.findByCreatedBy(user);
        }
        return tickets.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TicketResponseDto getTicketById(Long ticketId) {
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        return mapToResponse(ticket);
    }

    public TicketResponseDto assignTicket(Long ticketId, TicketAssignDto dto, Long adminId) {
        User admin = userRepo.findById(adminId).orElseThrow();
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        User technician = userRepo.findById(dto.getAssignedToId()).orElseThrow();
        ticket.setAssignedTo(technician);
        ticket = ticketRepo.save(ticket);
        return mapToResponse(ticket);
    }

    public TicketResponseDto updateStatus(Long ticketId, TicketUpdateDto dto, Long techId) {
        User tech = userRepo.findById(techId).orElseThrow();
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        ticket.setStatus(dto.getStatus());
        ticket = ticketRepo.save(ticket);
        return mapToResponse(ticket);
    }

    public void addComment(Long ticketId, CommentCreateDto dto, Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        Comment comment = new Comment(dto.getMessage(), ticket, user);
        commentRepo.save(comment);
    }

    private TicketResponseDto mapToResponse(Ticket ticket) {
        TicketResponseDto dto = new TicketResponseDto();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus());
        dto.setPriority(ticket.getPriority());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        if (ticket.getCreatedBy() != null) {
            dto.setCreatedBy(mapUserToSummary(ticket.getCreatedBy()));
        }
        if (ticket.getAssignedTo() != null) {
            dto.setAssignedTo(mapUserToSummary(ticket.getAssignedTo()));
        }
        dto.setComments(commentRepo.findByTicketOrderByIdAsc(ticket).stream().map(this::mapCommentToResponse).collect(Collectors.toList()));
        dto.setAttachments(attachmentRepo.findByTicket(ticket).stream().map(this::mapAttachmentToDto).collect(Collectors.toList()));
        return dto;
    }

    private UserSummaryDto mapUserToSummary(User user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        return dto;
    }

    private CommentResponseDto mapCommentToResponse(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setMessage(comment.getMessage());
        dto.setTimestamp(comment.getTimestamp());
        dto.setUser(mapUserToSummary(comment.getUser()));
        return dto;
    }

    private AttachmentDto mapAttachmentToDto(Attachment att) {
        AttachmentDto dto = new AttachmentDto();
        dto.setId(att.getId());
        dto.setFilePath(att.getFilePath());
        return dto;
    }
}