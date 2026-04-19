package com.smart.backend.TicketMgmt.service;

import com.smart.backend.TicketMgmt.dto.*;
import com.smart.backend.TicketMgmt.model.Attachment;
import com.smart.backend.TicketMgmt.model.Comment;
import com.smart.backend.TicketMgmt.model.Ticket;
import com.smart.backend.TicketMgmt.repo.AttachmentRepository;
import com.smart.backend.TicketMgmt.repo.CommentRepository;
import com.smart.backend.TicketMgmt.repo.TicketRepository;
import com.smart.backend.authentication.entity.Role;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepo;
    @Autowired
    private UserRepo authUserRepo;
    @Autowired
    private CommentRepository commentRepo;
    @Autowired
    private AttachmentRepository attachmentRepo;

    public TicketResponseDto createTicket(TicketCreateDto dto, Long userId) {
        Users user = authUserRepo.findById(userId.intValue()).orElseThrow();
        Ticket ticket = new Ticket(dto.getTitle(), dto.getDescription(), dto.getPriority(), user,
                                  dto.getRelatedBookingId(), dto.getRelatedResourceId());
        ticket.setCategory(dto.getCategory());
        ticket.setContactMethod(dto.getContactMethod());
        ticket.setContactDetails(dto.getContactDetails());
        ticket = ticketRepo.save(ticket);

        if (dto.getAttachmentFilePaths() != null) {
            if (dto.getAttachmentFilePaths().size() > 3) {
                throw new IllegalArgumentException("Maximum 3 attachments allowed per ticket");
            }
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
        Users user = authUserRepo.findById(userId.intValue()).orElseThrow();
        List<Ticket> tickets;
        if (hasRole(user, "ADMIN")) {
            tickets = ticketRepo.findAll();
        } else if (hasRole(user, "TECHNICIAN")) {
            tickets = ticketRepo.findByAssignedTo(user); 
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
    Users admin = authUserRepo.findById(adminId.intValue()).orElseThrow();
    if (!hasRole(admin, "ADMIN")) {
        throw new IllegalStateException("Only ADMIN users can assign tickets");
    }
    Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
    Users technician = authUserRepo.findById(dto.getAssignedToId().intValue()).orElseThrow();
    
    // validate the assignee is actually a technician
    if (!hasRole(technician, "TECHNICIAN")) {
        throw new IllegalArgumentException("Assigned user must have TECHNICIAN role");
    }
    
    ticket.setAssignedTo(technician);
    ticket = ticketRepo.save(ticket);
    return mapToResponse(ticket);
}
    public TicketResponseDto updateStatus(Long ticketId, TicketUpdateDto dto, Long techId) {
    Users tech = authUserRepo.findById(techId.intValue()).orElseThrow();
    Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();

    // Role check
    if (!hasRole(tech, "TECHNICIAN") && !hasRole(tech, "ADMIN")) {
        throw new IllegalStateException("Only TECHNICIAN or ADMIN users can update ticket status");
    }

    // technician can only update assigned ticket
    if (hasRole(tech, "TECHNICIAN")) {
    if (ticket.getAssignedTo() == null ||
        !Objects.equals((long) ticket.getAssignedTo().getUserId(), techId)) {
        throw new IllegalStateException("You can only update tickets assigned to you");
    }
}

    ticket.setStatus(dto.getStatus());

    if (dto.getResolutionNotes() != null && !dto.getResolutionNotes().isBlank()) {
        ticket.setResolutionNotes(dto.getResolutionNotes());
    }

    return mapToResponse(ticketRepo.save(ticket));
}
    public TicketResponseDto rejectTicket(Long ticketId, TicketRejectDto dto, Long adminId) {
        Users admin = authUserRepo.findById(adminId.intValue()).orElseThrow();
        if (!hasRole(admin, "ADMIN")) {
            throw new IllegalStateException("Only ADMIN users can reject tickets");
        }
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        ticket.setStatus(com.smart.backend.TicketMgmt.enums.TicketStatus.REJECTED);
        ticket.setRejectionReason(dto.getRejectionReason());
        ticket = ticketRepo.save(ticket);
        return mapToResponse(ticket);
    }

    public void addComment(Long ticketId, CommentCreateDto dto, Long userId) {
        Users user = authUserRepo.findById(userId.intValue()).orElseThrow();
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
        dto.setCategory(ticket.getCategory());
        dto.setContactMethod(ticket.getContactMethod());
        dto.setContactDetails(ticket.getContactDetails());
        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setRejectionReason(ticket.getRejectionReason());
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
        dto.setRelatedBookingId(ticket.getRelatedBookingId());
        dto.setRelatedResourceId(ticket.getRelatedResourceId());
        return dto;
    }

    private UserSummaryDto mapUserToSummary(Users user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId((long) user.getUserId());
        dto.setName(buildDisplayName(user));
        dto.setRole(getPrimaryRoleName(user));
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

    private boolean hasRole(Users user, String roleName) {
        return user.getRole() != null && user.getRole().stream()
                .filter(Objects::nonNull)
                .anyMatch(role -> roleName.equalsIgnoreCase(role.getRoleName()));
    }

    private String getPrimaryRoleName(Users user) {
        return user.getRole() == null || user.getRole().isEmpty()
                ? null
                : user.getRole().stream().filter(Objects::nonNull).findFirst().map(Role::getRoleName).orElse(null);
    }

    private String buildDisplayName(Users user) {
        String firstName = user.getUserFirstName();
        String lastName = user.getUserLastName();
        if (firstName != null && !firstName.isBlank()) {
            return (lastName != null && !lastName.isBlank())
                    ? firstName + " " + lastName
                    : firstName;
        }
        return user.getUserName();
    }
}