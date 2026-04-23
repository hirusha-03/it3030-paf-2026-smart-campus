package com.smart.backend.Notification.controller;

import com.smart.backend.Notification.dto.NotificationDTO;
import com.smart.backend.Notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Get all notifications
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(Principal principal) {
        return ResponseEntity.ok(
                notificationService.getNotificationsForUser(principal.getName())
        );
    }

    // Get unread count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Principal principal) {
        long count = notificationService.getUnreadCount(principal.getName());
        return ResponseEntity.ok(Map.of("count", count));
    }

    // Mark single as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Principal principal) {
        notificationService.markAsRead(id, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    // Mark all as read
    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
        return ResponseEntity.ok(Map.of("message", "All marked as read"));
    }
}
