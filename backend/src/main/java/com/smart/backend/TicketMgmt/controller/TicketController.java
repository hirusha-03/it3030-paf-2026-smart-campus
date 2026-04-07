package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.dto.*;
import com.smart.backend.TicketMgmt.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponseDto> createTicket(@RequestBody TicketCreateDto dto) {
        // TODO: Extract userId from JWT or auth context
        Long userId = 1L; // Placeholder: default user ID for now
        return ResponseEntity.ok(ticketService.createTicket(dto, userId));
    }

    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getTickets() {
        // TODO: Extract userId from JWT or auth context
        Long userId = 1L; // Placeholder: default user ID for now
        return ResponseEntity.ok(ticketService.getTicketsForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<TicketResponseDto> assignTicket(@PathVariable Long id, @RequestBody TicketAssignDto dto) {
        // TODO: Extract adminId from JWT or auth context and verify ADMIN role
        Long adminId = 1L; // Placeholder: default admin ID for now
        return ResponseEntity.ok(ticketService.assignTicket(id, dto, adminId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketResponseDto> updateStatus(@PathVariable Long id, @RequestBody TicketUpdateDto dto) {
        // TODO: Extract techId from JWT or auth context and verify TECHNICIAN role
        Long techId = 1L; // Placeholder: default technician ID for now
        return ResponseEntity.ok(ticketService.updateStatus(id, dto, techId));
    }
}
