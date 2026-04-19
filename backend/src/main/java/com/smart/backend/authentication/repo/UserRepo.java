package com.smart.backend.authentication.repo;

import com.smart.backend.authentication.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {

    boolean existsByUserName(String username);

    Optional<Users> findByUserName(String username);

    Optional<Users> findByEmail(String email);

    @Query("SELECT u FROM Users u JOIN u.role r WHERE r.roleName = :roleName")
    List<Users> findByRoleName(@Param("roleName") String roleName);
}
