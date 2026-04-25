package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.dto.CommentCreateDto;
import com.smart.backend.TicketMgmt.dto.CommentResponseDto;
import com.smart.backend.TicketMgmt.service.CommentService;
import com.smart.backend.TicketMgmt.service.TicketService;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/tickets/{ticketId}/comments")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepo userRepo;

    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @PostMapping
    public ResponseEntity<Void> addComment(@PathVariable Long ticketId, @RequestBody CommentCreateDto dto) {
        Long userId = getCurrentUserId();
        ticketService.addComment(ticketId, dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @RequestBody CommentCreateDto dto) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(commentService.updateComment(commentId, dto.getMessage(), userId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId) {
        Long userId = getCurrentUserId();
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            Users user = userRepo.findByUserName(userDetails.getUsername())
                    .orElseThrow(() -> new IllegalStateException("User not found"));
            return (long) user.getUserId();
        }
        throw new IllegalStateException("User not authenticated");
    }
}