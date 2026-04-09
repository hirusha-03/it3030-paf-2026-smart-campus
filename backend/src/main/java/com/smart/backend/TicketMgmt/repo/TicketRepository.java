package com.smart.backend.TicketMgmt.repo;

import com.smart.backend.TicketMgmt.model.Ticket;
import com.smart.backend.TicketMgmt.enums.TicketStatus;
import com.smart.backend.authentication.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy(Users user);
    List<Ticket> findByAssignedTo(Users user);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findAll(); // For admins to see all
}