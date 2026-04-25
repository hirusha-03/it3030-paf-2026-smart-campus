package com.smart.backend.TicketMgmt.repo;

import com.smart.backend.TicketMgmt.model.Comment;
import com.smart.backend.TicketMgmt.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketOrderByIdAsc(Ticket ticket);

    @Query("select c from Comment c join fetch c.user where c.ticket.id in :ticketIds order by c.id")
    List<Comment> findByTicketIdInWithUser(@Param("ticketIds") List<Long> ticketIds);
}