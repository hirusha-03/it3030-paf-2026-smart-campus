package com.smart.backend.authentication.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "users")
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

    @Column(name = "email", length = 255, unique = true, nullable = false) 
    private String email;


    @Column(name = "password", nullable = false)
    private String userPassword;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinTable(name = "USER_ROLE",
            joinColumns = {
                    @JoinColumn(name = "USER_ID")
            },
            inverseJoinColumns = {
                    @JoinColumn(name = "ROLE_ID")
            }
    )
    private Set<Role> role;

    /*public String getEmail() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getEmail'");
    }*/

    public String getEmail() {
        return email;
    }
    
    // ADD THIS SETTER METHOD
    public void setEmail(String email) {
        this.email = email;
    }

     public String getName() {
        if (userFirstName != null && userLastName != null) {
            return userFirstName + " " + userLastName;
        } else if (userFirstName != null) {
            return userFirstName;
        } else if (userLastName != null) {
            return userLastName;
        }
        return userName;
    }

}
