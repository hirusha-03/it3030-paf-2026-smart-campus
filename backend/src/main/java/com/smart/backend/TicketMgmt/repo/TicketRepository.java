package com.smart.backend.TicketMgmt.repo;

import com.smart.backend.TicketMgmt.model.Ticket;
import com.smart.backend.TicketMgmt.enums.TicketStatus;
import com.smart.backend.TicketMgmt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy(User user);
    List<Ticket> findByAssignedTo(User user);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findAll(); // For admins to see all
}