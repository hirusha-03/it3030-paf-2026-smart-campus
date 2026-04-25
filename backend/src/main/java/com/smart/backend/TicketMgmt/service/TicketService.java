package com.smart.backend.TicketMgmt.service;

import com.smart.backend.TicketMgmt.dto.*;
import com.smart.backend.TicketMgmt.enums.TicketStatus;
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
import java.util.Base64;

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
            final long maxBytes = 5L * 1024L * 1024L; // 5 MB
            for (String path : dto.getAttachmentFilePaths()) {
                if (path != null && path.startsWith("data:") && path.contains(",")) {
                    String base64 = path.substring(path.indexOf(',') + 1);
                    try {
                        byte[] decoded = Base64.getDecoder().decode(base64);
                        if (decoded.length > maxBytes) {
                            throw new IllegalArgumentException("Attachment exceeds maximum allowed size of 5 MB");
                        }
                    } catch (IllegalArgumentException iae) {
                        throw iae; // rethrow size/decoding issues
                    } catch (Exception ex) {
                        throw new IllegalArgumentException("Invalid attachment data");
                    }
                }
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
        if (hasRole(user, "Admin")) {
            tickets = ticketRepo.findAll();
        } else if (hasRole(user, "Technician")) {
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
    if (!hasRole(admin, "Admin")) {
        throw new IllegalStateException("Only Admin users can assign tickets");
    }

    Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();

    // Can only assign OPEN tickets
    if (ticket.getStatus() != TicketStatus.OPEN) {
        throw new IllegalStateException("Only OPEN tickets can be assigned");
    }

    Users technician = authUserRepo.findById(dto.getAssignedToId().intValue()).orElseThrow();
    if (!hasRole(technician, "Technician")) {
        throw new IllegalArgumentException("Assigned user must have Technician role");
    }

    ticket.setAssignedTo(technician);
    // Automatically move to IN_PROGRESS when assigned
    ticket.setStatus(TicketStatus.IN_PROGRESS);

    return mapToResponse(ticketRepo.save(ticket));
}

public TicketResponseDto updateStatus(Long ticketId, TicketUpdateDto dto, Long techId) {
    Users tech = authUserRepo.findById(techId.intValue()).orElseThrow();
    Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();

    if (!hasRole(tech, "Technician") && !hasRole(tech, "Admin")) {
        throw new IllegalStateException("Only Technician or Admin users can update ticket status");
    }

    // Technician can only update their assigned ticket
    if (hasRole(tech, "Technician")) {
        if (ticket.getAssignedTo() == null ||
            ticket.getAssignedTo().getUserId() != techId.intValue()) {
            throw new IllegalStateException("You can only update tickets assigned to you");
        }
    }

    // Terminal states — nobody can change these
    if (ticket.getStatus() == TicketStatus.CLOSED ||
        ticket.getStatus() == TicketStatus.REJECTED) {
        throw new IllegalStateException("Cannot change status of a " + ticket.getStatus() + " ticket");
    }

    // Enforce valid transitions
    TicketStatus current = ticket.getStatus();
    TicketStatus next = dto.getStatus();

    if (current == next) {
    return mapToResponse(ticket);
    }

    boolean validTransition =
        (current == TicketStatus.IN_PROGRESS && next == TicketStatus.RESOLVED) ||
        (current == TicketStatus.RESOLVED    && next == TicketStatus.CLOSED);

    if (!validTransition) {
        throw new IllegalStateException(
            "Invalid status transition: " + current + " → " + next +
            ". Allowed: IN_PROGRESS → RESOLVED, RESOLVED → CLOSED"
        );
    }

    // Resolution notes only allowed when resolving or closing
    if (dto.getResolutionNotes() != null && !dto.getResolutionNotes().isBlank()) {
        if (next == TicketStatus.RESOLVED || next == TicketStatus.CLOSED) {
            ticket.setResolutionNotes(dto.getResolutionNotes());
        } else {
            throw new IllegalArgumentException("Resolution notes can only be added when status is RESOLVED or CLOSED");
        }
    }

    ticket.setStatus(next);
    return mapToResponse(ticketRepo.save(ticket));
}

public TicketResponseDto rejectTicket(Long ticketId, TicketRejectDto dto, Long adminId) {
    Users admin = authUserRepo.findById(adminId.intValue()).orElseThrow();
    if (!hasRole(admin, "Admin")) {
        throw new IllegalStateException("Only Admin users can reject tickets");
    }

    Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();

    // Can only reject OPEN tickets
    if (ticket.getStatus() != TicketStatus.OPEN) {
        throw new IllegalStateException("Only OPEN tickets can be rejected");
    }

    ticket.setStatus(TicketStatus.REJECTED);
    ticket.setRejectionReason(dto.getRejectionReason());
    return mapToResponse(ticketRepo.save(ticket));
}
    
    public void deleteTicket(Long ticketId, Long adminId) {
        Users admin = authUserRepo.findById(adminId.intValue()).orElseThrow();
        if (!hasRole(admin, "Admin")) {
            throw new IllegalStateException("Only Admin users can delete tickets");
        }

        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();

        // Only allow deletion for CLOSED or REJECTED tickets
        if (ticket.getStatus() != TicketStatus.CLOSED && ticket.getStatus() != TicketStatus.REJECTED) {
            throw new IllegalStateException("Only CLOSED or REJECTED tickets can be deleted");
        }

        // Remove related attachments and comments first to satisfy constraints
        try {
            attachmentRepo.findByTicket(ticket).forEach(attachmentRepo::delete);
        } catch (Exception ignored) {}
        try {
            commentRepo.findByTicketOrderByIdAsc(ticket).forEach(commentRepo::delete);
        } catch (Exception ignored) {}

        ticketRepo.delete(ticket);
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
        if (att.getFilePath() != null) {
            try {
                java.nio.file.Path p = java.nio.file.Paths.get(att.getFilePath());
                dto.setFileName(p.getFileName().toString());
            } catch (Exception e) {
                String fp = att.getFilePath();
                int idx = Math.max(fp.lastIndexOf('/'), fp.lastIndexOf('\\'));
                dto.setFileName(idx >= 0 ? fp.substring(idx + 1) : fp);
            }
        }
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