package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.dto.AttachmentDto;
import com.smart.backend.TicketMgmt.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/tickets/{ticketId}/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @GetMapping
    public ResponseEntity<List<AttachmentDto>> getAttachments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(attachmentService.getAttachmentsByTicket(ticketId));
    }

    @PostMapping
    public ResponseEntity<Void> addAttachment(@PathVariable Long ticketId, @RequestBody AttachmentDto dto) {
        attachmentService.saveAttachment(ticketId, dto.getFilePath());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}