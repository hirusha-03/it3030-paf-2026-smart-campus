package com.smart.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.smart.backend"})
@EnableJpaRepositories(basePackages = {
    "com.smart.backend.ResourceMgmt.repo",
    "com.smart.backend.TicketMgmt.repo",
    "com.smart.backend.authentication.repo",
    "com.smart.backend.BookingMgmt.repo",
    "com.smart.backend.Notification.repo"
})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
