package com.smart.backend.Notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationDTO {

    private Long id;
    private String title;
    private String message;
    private String type;
    private Long bookingId;
    private boolean read;
    private LocalDateTime createdAt;
}
