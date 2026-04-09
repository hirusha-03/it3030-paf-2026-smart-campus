package com.smart.backend.TicketMgmt.service;

import com.smart.backend.TicketMgmt.dto.UserSummaryDto;
import com.smart.backend.authentication.entity.Role;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepo authUserRepo;

    public List<UserSummaryDto> getUsersByRoleName(String roleName) {
        return authUserRepo.findAll().stream()
                .filter(user -> user.getRole() != null && user.getRole().stream()
                        .filter(Objects::nonNull)
                        .anyMatch(role -> roleName.equalsIgnoreCase(role.getRoleName())))
                .map(this::mapUserToSummary)
                .collect(Collectors.toList());
    }

    public Users getUserById(Long id) {
        return authUserRepo.findById(id.intValue()).orElseThrow();
    }

    private UserSummaryDto mapUserToSummary(Users user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId((long) user.getUserId());
        dto.setName(buildDisplayName(user));
        dto.setRole(getPrimaryRoleName(user));
        return dto;
    }

    private String getPrimaryRoleName(Users user) {
        return user.getRole() == null || user.getRole().isEmpty()
                ? null
                : user.getRole().stream().filter(Objects::nonNull).findFirst().map(Role::getRoleName).orElse(null);
    }

    private String buildDisplayName(Users user) {
        String firstName = user.getUserFirstName();
        String lastName = user.getUserLastName();
        if (firstName != null && !firstName.isBlank()) {
            return (lastName != null && !lastName.isBlank())
                    ? firstName + " " + lastName
                    : firstName;
        }
        return user.getUserName();
    }
}