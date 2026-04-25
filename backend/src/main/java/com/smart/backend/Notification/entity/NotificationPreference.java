package com.smart.backend.Notification.entity;

import com.smart.backend.authentication.entity.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification_preferences")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private Users user;

    // Booking notifications
    @Column(nullable = false)
    @Builder.Default
    private boolean bookingCreated = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean bookingApproved = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean bookingRejected = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean bookingCancelled = true;

    // Ticket notifications
    @Column(nullable = false)
    @Builder.Default
    private boolean ticketCreated = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean ticketAssigned = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean ticketStatusUpdated = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean ticketResolved = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean ticketClosed = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean ticketRejected = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean ticketComment = true;
}
