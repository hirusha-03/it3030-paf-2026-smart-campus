package com.smart.backend.TicketMgmt.service;

import com.smart.backend.TicketMgmt.dto.CommentResponseDto;
import com.smart.backend.TicketMgmt.dto.UserSummaryDto;
import com.smart.backend.TicketMgmt.model.Comment;
import com.smart.backend.TicketMgmt.model.Ticket;
import com.smart.backend.TicketMgmt.repo.CommentRepository;
import com.smart.backend.TicketMgmt.repo.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
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

    private UserSummaryDto mapUserToSummary(com.smart.backend.TicketMgmt.model.User user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        return dto;
    }
}