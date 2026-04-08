package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.dto.CommentCreateDto;
import com.smart.backend.TicketMgmt.dto.CommentResponseDto;
import com.smart.backend.TicketMgmt.service.CommentService;
import com.smart.backend.TicketMgmt.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/tickets/{ticketId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @PostMapping
    public ResponseEntity<Void> addComment(@PathVariable Long ticketId, @RequestBody CommentCreateDto dto) {
        // TODO: Extract userId from JWT or auth context
        Long userId = 1L; // Placeholder: default user ID for now
        ticketService.addComment(ticketId, dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}