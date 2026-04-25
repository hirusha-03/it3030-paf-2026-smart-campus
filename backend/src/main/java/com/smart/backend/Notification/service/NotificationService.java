package com.smart.backend.Notification.service;

import com.smart.backend.Notification.dto.NotificationDTO;
import com.smart.backend.Notification.entity.Notification;
import com.smart.backend.Notification.repo.NotificationRepository;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepo userRepo;

    // Create a notification
    public void createNotification(Users user, String title,
                                   String message, String type, Long bookingId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .bookingId(bookingId)
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    // Get all notifications for logged-in user
    public List<NotificationDTO> getNotificationsForUser(String username) {
        Users user = resolveUser(username);
        return notificationRepository
                .findByUserUserIdOrderByCreatedAtDesc(user.getUserId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get unread count
    public long getUnreadCount(String username) {
        Users user = resolveUser(username);
        return notificationRepository.countByUserUserIdAndReadFalse(user.getUserId());
    }

    // Mark single notification as read
    @Transactional
    public void markAsRead(Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        Users user = resolveUser(username);
        if (notification.getUser().getUserId() != user.getUserId()) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // Mark all notifications as read
    @Transactional
    public void markAllAsRead(String username) {
        Users user = resolveUser(username);
        notificationRepository.markAllAsReadByUserId(user.getUserId());
    }

    private Users resolveUser(String username) {
        return userRepo.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private NotificationDTO toDTO(Notification n) {
        return new NotificationDTO(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.getBookingId(),
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
