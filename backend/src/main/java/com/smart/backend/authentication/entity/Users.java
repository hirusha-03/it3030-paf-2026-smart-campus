package com.smart.backend.authentication.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "userss")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Users {

    @Id
    @Column(name = "user_id", length = 45)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int userId;

    @Column(name = "user_firstname", length = 255)
    private String userFirstName;

    @Column(name = "user_lastname")
    private String userLastName;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "username", length = 100, nullable = false)
    private String userName;


    @Column(name = "password", nullable = false)
    private String userPassword;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "USER_ROLE",
            joinColumns = {
                    @JoinColumn(name = "USER_ID")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "ROLE_ID")
            }
    )
    private Set<Role> role;

}
