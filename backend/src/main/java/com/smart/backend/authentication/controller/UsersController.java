package com.smart.backend.authentication.controller;

import com.smart.backend.BookingMgmt.model.Booking;
import com.smart.backend.BookingMgmt.repo.BookingRepository;
import com.smart.backend.Notification.repo.NotificationRepository;
import com.smart.backend.ResourceMgmt.enums.ResourceStatus;
import com.smart.backend.ResourceMgmt.repo.ResourceRepository;
import com.smart.backend.TicketMgmt.dto.UserSummaryDto;
import com.smart.backend.TicketMgmt.enums.TicketStatus;
import com.smart.backend.TicketMgmt.repo.TicketRepository;
import com.smart.backend.authentication.dto.DashboardStatsDTO;
import com.smart.backend.authentication.dto.SignupRequest;
import com.smart.backend.authentication.dto.UserProfileResponse;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import com.smart.backend.authentication.service.UserService;
import com.smart.backend.authentication.util.StandardResponse;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin
public class UsersController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostConstruct
    public void initRoleAndUser(){
        userService.initRoleAndUser();
    }

    @PostMapping("/register-new-user")
    public Users registerNewUser(@RequestBody SignupRequest signupRequest){
        return userService.registerNewUser(signupRequest);
    }

    @GetMapping({"/for-admin"})
    public String forAdmin(){
        return "this url is only accessible to admin";
    }

    @GetMapping({"/for-user"})
    public String forUser(){
        return "this url is only accessible to user";
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {

        return ResponseEntity.ok(userService.getUserProfile(authentication.getName()));
    }

    //@PreAuthorize("hasRole('Admin')")
    @GetMapping("/technicians")
    public ResponseEntity<List<UserSummaryDto>> getTechnicians() {
        return ResponseEntity.ok(userService.getUsersByRole("Technician"));
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean available = userRepo.findByUserName(username).isEmpty();
        return ResponseEntity.ok(Map.of("available", available));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean available = userRepo.findByEmail(email).isEmpty();
        return ResponseEntity.ok(Map.of("available", available));
    }

    @GetMapping("/me/stats")
    public ResponseEntity<Map<String, Long>> getUserStats(Authentication authentication) {
        String username = authentication.getName();

        Users user = userRepo.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        long bookingCount = bookingRepository.countByUser(user);
        long ticketCount  = ticketRepository.countByCreatedBy(user);

        return ResponseEntity.ok(Map.of(
                "bookings", bookingCount,
                "tickets",  ticketCount
        ));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(Authentication authentication) {
        String username = authentication.getName();

        Users user = userRepo.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        boolean isAdmin = user.getRole().stream()
                .anyMatch(r -> "Admin".equalsIgnoreCase(r.getRoleName()));

        // Available facilities — ACTIVE resources (same for all roles)
        long availableFacilities = resourceRepository
                .findByStatus(ResourceStatus.ACTIVE).size();

        // Active bookings
        long activeBookings;
        if (isAdmin) {
            // Admin sees all non-cancelled/rejected bookings
            activeBookings = bookingRepository.findAll().stream()
                    .filter(b -> b.getStatus() != Booking.BookingStatus.CANCELLED
                            && b.getStatus() != Booking.BookingStatus.REJECTED)
                    .count();
        } else {
            // User sees only their own active bookings
            activeBookings = bookingRepository.findAll().stream()
                    .filter(b -> b.getUser().getUserId() == user.getUserId()
                            && b.getStatus() != Booking.BookingStatus.CANCELLED
                            && b.getStatus() != Booking.BookingStatus.REJECTED)
                    .count();
        }

        // Pending tickets
        long pendingTickets;
        if (isAdmin) {
            // Admin sees all OPEN tickets
            pendingTickets = ticketRepository
                    .findByStatus(TicketStatus.OPEN).size();
        } else {
            // User sees only their own OPEN tickets
            pendingTickets = ticketRepository.findByCreatedBy(user).stream()
                    .filter(t -> t.getStatus() == TicketStatus.OPEN)
                    .count();
        }

        // Unread notifications for this user
        long newNotifications = notificationRepository
                .countByUserUserIdAndReadFalse(user.getUserId());

        return ResponseEntity.ok(new DashboardStatsDTO(
                availableFacilities,
                activeBookings,
                pendingTickets,
                newNotifications
        ));
    }
}
