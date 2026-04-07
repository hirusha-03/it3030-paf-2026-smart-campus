package com.smart.backend.TicketMgmt.repo;

import com.smart.backend.TicketMgmt.model.User;
import com.smart.backend.TicketMgmt.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
}