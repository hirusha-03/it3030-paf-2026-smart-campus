package com.smart.backend.authentication.repo;

import com.smart.backend.authentication.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo extends JpaRepository<Role, Integer> {
    boolean existsByRoleName(String roleName);

    Role findByRoleName(String requestedRole);
}
