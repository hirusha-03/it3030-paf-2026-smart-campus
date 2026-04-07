package com.smart.backend.TicketMgmt.service;

import com.smart.backend.TicketMgmt.enums.Role;
import com.smart.backend.TicketMgmt.model.User;
import com.smart.backend.TicketMgmt.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public List<User> getUsersByRole(Role role) {
        return userRepo.findByRole(role);
    }

    public User getUserById(Long id) {
        return userRepo.findById(id).orElseThrow();
    }
}