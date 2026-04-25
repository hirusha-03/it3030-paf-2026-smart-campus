package com.smart.backend.TicketMgmt.event;

import com.smart.backend.TicketMgmt.enums.TicketStatus;
import java.time.LocalDateTime;

public class TicketStatusChangedEvent {
    private final Long ticketId;
    private final TicketStatus fromStatus;
    private final TicketStatus toStatus;
    private final Long performedByUserId;
    private final LocalDateTime occurredAt;

    public TicketStatusChangedEvent(Long ticketId, TicketStatus fromStatus, TicketStatus toStatus, Long performedByUserId, LocalDateTime occurredAt) {
        this.ticketId = ticketId;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.performedByUserId = performedByUserId;
        this.occurredAt = occurredAt;
    }

    public Long getTicketId() { return ticketId; }
    public TicketStatus getFromStatus() { return fromStatus; }
    public TicketStatus getToStatus() { return toStatus; }
    public Long getPerformedByUserId() { return performedByUserId; }
    public LocalDateTime getOccurredAt() { return occurredAt; }
}
