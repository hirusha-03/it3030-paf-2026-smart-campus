package com.smart.backend.authentication.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "role")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Role {

    @Id
    @Column(name = "role_id", length = 45)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int roleId;

    @Column(name = "role_name", length = 45)
    private String roleName;

    @Column(name = "role_description", length = 45)
    private String roleDescription;

}
