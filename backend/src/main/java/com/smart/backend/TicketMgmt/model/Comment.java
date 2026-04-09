package com.smart.backend.TicketMgmt.model;

import com.smart.backend.authentication.entity.Users;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    private LocalDateTime timestamp;

    // Constructors
    public Comment() {}

    public Comment(String message, Ticket ticket, Users user) {
        this.message = message;
        this.ticket = ticket;
        this.user = user;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}