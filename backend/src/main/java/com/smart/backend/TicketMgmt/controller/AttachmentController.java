package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.dto.AttachmentDto;
import com.smart.backend.TicketMgmt.service.AttachmentService;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
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

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentDto> uploadAttachment(@PathVariable Long ticketId, @RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        final long MAX_BYTES = 5L * 1024L * 1024L; // 5 MB
        final String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        if (!(contentType.equals("image/png") || contentType.equals("image/jpeg") || contentType.equals("image/jpg"))) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
        }
        if (file.getSize() > MAX_BYTES) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
        }

        try {
            String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads";
            Files.createDirectories(Paths.get(uploadsDir));

            String original = file.getOriginalFilename();
            String safeName = Instant.now().toEpochMilli() + "_" + (original == null ? "file" : original.replaceAll("[^a-zA-Z0-9._-]", "_"));
            Path dest = Paths.get(uploadsDir).resolve(safeName);
            file.transferTo(dest.toFile());

            // Save a reference in DB (absolute path). You may change to a public URL if serving files.
            String savedPath = dest.toAbsolutePath().toString();
            attachmentService.saveAttachment(ticketId, savedPath);

            AttachmentDto dto = new AttachmentDto();
            dto.setFilePath(savedPath);
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}