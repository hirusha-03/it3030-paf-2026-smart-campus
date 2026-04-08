package com.smart.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.smart.backend"})
@EnableJpaRepositories(basePackages = {
    "com.smart.backend.ResourceMgmt.repo",
    "com.smart.backend.TicketMgmt.repo"
})
@EntityScan(basePackages = {
    "com.smart.backend.ResourceMgmt.model",
    "com.smart.backend.TicketMgmt.model"
})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
