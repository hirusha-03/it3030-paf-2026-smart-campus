package com.smart.backend.TicketMgmt.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class TicketEventListener {
    private static final Logger LOG = Logger.getLogger(TicketEventListener.class.getName());

    @EventListener
    public void onTicketStatusChanged(TicketStatusChangedEvent ev) {
        // Simple listener: log the change. Replace with audit DB write or notification publishing as needed.
        LOG.log(Level.INFO, "Ticket {0} status changed {1} -> {2} by user {3} at {4}",
                new Object[]{ev.getTicketId(), ev.getFromStatus(), ev.getToStatus(), ev.getPerformedByUserId(), ev.getOccurredAt()});
    }
}
