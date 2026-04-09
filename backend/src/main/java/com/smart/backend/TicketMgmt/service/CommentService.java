package com.smart.backend.TicketMgmt.service;

import com.smart.backend.TicketMgmt.dto.CommentResponseDto;
import com.smart.backend.TicketMgmt.dto.UserSummaryDto;
import com.smart.backend.TicketMgmt.model.Comment;
import com.smart.backend.TicketMgmt.model.Ticket;
import com.smart.backend.TicketMgmt.repo.CommentRepository;
import com.smart.backend.TicketMgmt.repo.TicketRepository;
import com.smart.backend.authentication.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;
    @Autowired
    private TicketRepository ticketRepo;

    public List<CommentResponseDto> getCommentsByTicket(Long ticketId) {
        Ticket ticket = ticketRepo.findById(ticketId).orElseThrow();
        List<Comment> comments = commentRepo.findByTicketOrderByIdAsc(ticket);
        return comments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private CommentResponseDto mapToResponse(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setMessage(comment.getMessage());
        dto.setTimestamp(comment.getTimestamp());
        dto.setUser(mapUserToSummary(comment.getUser()));
        return dto;
    }

    private UserSummaryDto mapUserToSummary(Users user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId((long) user.getUserId());
        dto.setName(buildDisplayName(user));
        dto.setRole(getPrimaryRoleName(user));
        return dto;
    }

    private String getPrimaryRoleName(Users user) {
        return user.getRole() == null || user.getRole().isEmpty()
                ? null
                : user.getRole().stream().filter(Objects::nonNull).findFirst().map(r -> r.getRoleName()).orElse(null);
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