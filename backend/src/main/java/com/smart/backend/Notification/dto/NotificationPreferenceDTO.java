package com.smart.backend.Notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationPreferenceDTO {

    // Booking
    private boolean bookingCreated;
    private boolean bookingApproved;
    private boolean bookingRejected;
    private boolean bookingCancelled;

    // Ticket
    private boolean ticketCreated;
    private boolean ticketAssigned;
    private boolean ticketStatusUpdated;
    private boolean ticketResolved;
    private boolean ticketClosed;
    private boolean ticketRejected;
    private boolean ticketComment;
}
