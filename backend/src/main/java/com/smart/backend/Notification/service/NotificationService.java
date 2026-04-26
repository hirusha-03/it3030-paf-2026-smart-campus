package com.smart.backend.Notification.service;

import com.smart.backend.Notification.dto.NotificationDTO;
import com.smart.backend.Notification.dto.NotificationPreferenceDTO;
import com.smart.backend.Notification.entity.Notification;
import com.smart.backend.Notification.entity.NotificationPreference;
import com.smart.backend.Notification.repo.NotificationPreferenceRepository;
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
    private NotificationPreferenceRepository preferenceRepository;

    @Autowired
    private UserRepo userRepo;

    //  Create notification — check preference first
    public void createNotification(Users user, String title,
                                   String message, String type, Long referenceId) {

        // Check if user wants this type of notification
        if (!isNotificationEnabled(user, type)) return;

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .bookingId(referenceId)
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    // Check if notification type is enabled for user
    private boolean isNotificationEnabled(Users user, String type) {
        NotificationPreference pref = preferenceRepository
                .findByUserUserId(user.getUserId())
                .orElse(null);

        // If no preference set — all enabled by default
        if (pref == null) return true;

        return switch (type) {
            case "BOOKING_CREATED"       -> pref.isBookingCreated();
            case "BOOKING_APPROVED"      -> pref.isBookingApproved();
            case "BOOKING_REJECTED"      -> pref.isBookingRejected();
            case "BOOKING_CANCELLED"     -> pref.isBookingCancelled();
            case "TICKET_CREATED"        -> pref.isTicketCreated();
            case "TICKET_ASSIGNED"       -> pref.isTicketAssigned();
            case "TICKET_STATUS_UPDATED" -> pref.isTicketStatusUpdated();
            case "TICKET_RESOLVED"       -> pref.isTicketResolved();
            case "TICKET_CLOSED"         -> pref.isTicketClosed();
            case "TICKET_REJECTED"       -> pref.isTicketRejected();
            case "TICKET_COMMENT"        -> pref.isTicketComment();
            default                      -> true;
        };
    }

    // Get preferences for logged-in user
    public NotificationPreferenceDTO getPreferences(String username) {
        Users user = resolveUser(username);
        NotificationPreference pref = preferenceRepository
                .findByUserUserId(user.getUserId())
                .orElse(createDefaultPreference(user));

        return toPreferenceDTO(pref);
    }

    // Update preferences
    @Transactional
    public NotificationPreferenceDTO updatePreferences(String username,
                                                       NotificationPreferenceDTO dto) {
        Users user = resolveUser(username);

        NotificationPreference pref = preferenceRepository
                .findByUserUserId(user.getUserId())
                .orElse(NotificationPreference.builder().user(user).build());

        pref.setBookingCreated(dto.isBookingCreated());
        pref.setBookingApproved(dto.isBookingApproved());
        pref.setBookingRejected(dto.isBookingRejected());
        pref.setBookingCancelled(dto.isBookingCancelled());
        pref.setTicketCreated(dto.isTicketCreated());
        pref.setTicketAssigned(dto.isTicketAssigned());
        pref.setTicketStatusUpdated(dto.isTicketStatusUpdated());
        pref.setTicketResolved(dto.isTicketResolved());
        pref.setTicketClosed(dto.isTicketClosed());
        pref.setTicketRejected(dto.isTicketRejected());
        pref.setTicketComment(dto.isTicketComment());

        NotificationPreference saved = preferenceRepository.save(pref);
        return toPreferenceDTO(saved);
    }

    // Reset all preferences to default (all enabled)
    @Transactional
    public NotificationPreferenceDTO resetPreferences(String username) {
        Users user = resolveUser(username);

        NotificationPreference pref = preferenceRepository
                .findByUserUserId(user.getUserId())
                .orElse(NotificationPreference.builder().user(user).build());

        pref.setBookingCreated(true);
        pref.setBookingApproved(true);
        pref.setBookingRejected(true);
        pref.setBookingCancelled(true);
        pref.setTicketCreated(true);
        pref.setTicketAssigned(true);
        pref.setTicketStatusUpdated(true);
        pref.setTicketResolved(true);
        pref.setTicketClosed(true);
        pref.setTicketRejected(true);
        pref.setTicketComment(true);

        NotificationPreference saved = preferenceRepository.save(pref);
        return toPreferenceDTO(saved);
    }

    // Existing methods unchanged
    public List<NotificationDTO> getNotificationsForUser(String username) {
        Users user = resolveUser(username);
        return notificationRepository
                .findByUserUserIdOrderByCreatedAtDesc(user.getUserId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String username) {
        Users user = resolveUser(username);
        return notificationRepository.countByUserUserIdAndReadFalse(user.getUserId());
    }

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

    @Transactional
    public void markAllAsRead(String username) {
        Users user = resolveUser(username);
        notificationRepository.markAllAsReadByUserId(user.getUserId());
    }

    private NotificationPreference createDefaultPreference(Users user) {
        return NotificationPreference.builder().user(user).build();
    }

    private Users resolveUser(String username) {
        return userRepo.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private NotificationDTO toDTO(Notification n) {
        return new NotificationDTO(
                n.getId(), n.getTitle(), n.getMessage(),
                n.getType(), n.getBookingId(), n.isRead(), n.getCreatedAt()
        );
    }

    private NotificationPreferenceDTO toPreferenceDTO(NotificationPreference p) {
        return NotificationPreferenceDTO.builder()
                .bookingCreated(p.isBookingCreated())
                .bookingApproved(p.isBookingApproved())
                .bookingRejected(p.isBookingRejected())
                .bookingCancelled(p.isBookingCancelled())
                .ticketCreated(p.isTicketCreated())
                .ticketAssigned(p.isTicketAssigned())
                .ticketStatusUpdated(p.isTicketStatusUpdated())
                .ticketResolved(p.isTicketResolved())
                .ticketClosed(p.isTicketClosed())
                .ticketRejected(p.isTicketRejected())
                .ticketComment(p.isTicketComment())
                .build();
    }
}
