package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.dto.*;
import com.smart.backend.TicketMgmt.service.TicketService;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/tickets")
@CrossOrigin
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepo userRepo;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<TicketResponseDto> createTicket(@RequestBody TicketCreateDto dto) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(ticketService.createTicket(dto, userId));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getTickets() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(ticketService.getTicketsForUser(userId));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketResponseDto> assignTicket(@PathVariable Long id, @RequestBody TicketAssignDto dto) {
        Long adminId = getCurrentUserId();
        return ResponseEntity.ok(ticketService.assignTicket(id, dto, adminId));
    }

    @PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<TicketResponseDto> updateStatus(@PathVariable Long id, @RequestBody TicketUpdateDto dto) {
        Long techId = getCurrentUserId();
        return ResponseEntity.ok(ticketService.updateStatus(id, dto, techId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<TicketResponseDto> rejectTicket(@PathVariable Long id, @RequestBody TicketRejectDto dto) {
        Long adminId = getCurrentUserId();
        return ResponseEntity.ok(ticketService.rejectTicket(id, dto, adminId));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User) {
            org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            return getUserIdFromUsername(userDetails.getUsername());
        }
        throw new IllegalStateException("User not authenticated");
    }

    private Long getUserIdFromUsername(String username) {
        Users user = userRepo.findByUserName(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return (long) user.getUserId();
    }
}