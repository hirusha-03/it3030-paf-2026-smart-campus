package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.dto.AttachmentDto;
import com.smart.backend.TicketMgmt.service.AttachmentService;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import jakarta.servlet.http.HttpServletRequest;
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
@CrossOrigin
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @GetMapping
    public ResponseEntity<List<AttachmentDto>> getAttachments(@PathVariable Long ticketId, HttpServletRequest request) {
        List<AttachmentDto> dtos = attachmentService.getAttachmentsByTicket(ticketId);
        // Convert stored file paths to URLs that the frontend can fetch
        for (AttachmentDto dto : dtos) {
            if (dto.getId() != null) {
                String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/tickets/")
                        .path(String.valueOf(ticketId))
                        .path("/attachments/")
                        .path(String.valueOf(dto.getId()))
                        .path("/raw")
                        .toUriString();
                dto.setFilePath(url);
            }
        }
        return ResponseEntity.ok(dtos);
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
            // Keep uploads inside the backend module to avoid creating files in the repo root
            String uploadsDir = System.getProperty("user.dir") + File.separator + "backend" + File.separator + "uploads";
            Files.createDirectories(Paths.get(uploadsDir));

            String original = file.getOriginalFilename();
            String safeName = Instant.now().toEpochMilli() + "_" + (original == null ? "file" : original.replaceAll("[^a-zA-Z0-9._-]", "_"));
            Path dest = Paths.get(uploadsDir).resolve(safeName);
            file.transferTo(dest.toFile());

            // Save a reference in DB (absolute path). You may change to a public URL if serving files.
                String savedPath = dest.toAbsolutePath().toString();
                com.smart.backend.TicketMgmt.model.Attachment saved = attachmentService.saveAttachment(ticketId, savedPath);

                AttachmentDto dto = new AttachmentDto();
                dto.setId(saved.getId());
                String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/tickets/")
                    .path(String.valueOf(ticketId))
                    .path("/attachments/")
                    .path(String.valueOf(saved.getId()))
                    .path("/raw")
                    .toUriString();
                dto.setFilePath(url);
                return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping(path = "/{attachmentId}/raw")
    public ResponseEntity<byte[]> getAttachmentRaw(@PathVariable Long ticketId, @PathVariable Long attachmentId) {
        try {
            String path = attachmentService.getAttachmentFilePath(attachmentId);
            if (path == null) return ResponseEntity.notFound().build();
            java.nio.file.Path p = java.nio.file.Paths.get(path);
            if (!java.nio.file.Files.exists(p)) return ResponseEntity.notFound().build();
            String contentType = java.nio.file.Files.probeContentType(p);
            if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            byte[] data = java.nio.file.Files.readAllBytes(p);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=\"" + p.getFileName().toString() + "\"")
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .body(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}