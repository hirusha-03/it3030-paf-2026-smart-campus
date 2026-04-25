package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.dto.*;
import com.smart.backend.TicketMgmt.service.TicketService;
import com.smart.backend.TicketMgmt.dto.UserSummaryDto;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import com.smart.backend.authentication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
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

    @Autowired
    private UserService userService;

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
        List<TicketResponseDto> tickets = ticketService.getTicketsForUser(userId);

        for (TicketResponseDto t : tickets) {
            if (t.getAttachments() != null) {
                for (AttachmentDto a : t.getAttachments()) {
                    if (a.getId() != null) {
                        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/api/tickets/")
                                .path(String.valueOf(t.getId()))
                                .path("/attachments/")
                                .path(String.valueOf(a.getId()))
                                .path("/raw")
                                .toUriString();
                        a.setFilePath(url);
                    }
                }
            }
        }
        return ResponseEntity.ok(tickets);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicket(@PathVariable Long id) {
        TicketResponseDto dto = ticketService.getTicketById(id);

        if (dto.getAttachments() != null) {
            for (AttachmentDto a : dto.getAttachments()) {
                if (a.getId() != null) {
                    String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/api/tickets/")
                            .path(String.valueOf(dto.getId()))
                            .path("/attachments/")
                            .path(String.valueOf(a.getId()))
                            .path("/raw")
                            .toUriString();
                    a.setFilePath(url);
                }
            }
        }
        return ResponseEntity.ok(dto);
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

    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        Long adminId = getCurrentUserId();
        ticketService.deleteTicket(id, adminId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/technicians")
    public ResponseEntity<List<UserSummaryDto>> getTechnicians() {
        return ResponseEntity.ok(userService.getUsersByRole("Technician"));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null &&
            authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User userDetails) {
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