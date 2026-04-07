package com.smart.backend.TicketMgmt.controller;

import com.smart.backend.TicketMgmt.enums.Role;
import com.smart.backend.TicketMgmt.model.User;
import com.smart.backend.TicketMgmt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/technicians")
    public ResponseEntity<List<User>> getTechnicians() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.TECHNICIAN));
    }
}