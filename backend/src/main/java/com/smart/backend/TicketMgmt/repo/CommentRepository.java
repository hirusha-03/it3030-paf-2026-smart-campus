package com.smart.backend.TicketMgmt.repo;

import com.smart.backend.TicketMgmt.model.Comment;
import com.smart.backend.TicketMgmt.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketOrderByIdAsc(Ticket ticket);
}