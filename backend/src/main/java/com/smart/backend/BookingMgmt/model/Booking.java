package com.smart.backend.BookingMgmt.model;

import com.smart.backend.ResourceMgmt.model.Resource;
import com.smart.backend.authentication.entity.Users;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingID")
    private Long bookingId;

    @Column(name = "Date", nullable = false)
    private LocalDate date;

    @Column(name = "Start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "Purpose", nullable = false, length = 500)
    private String purpose;

    @Column(name = "Exp_attendees", nullable = false)
    private Integer expectedAttendees;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = false)
    private BookingStatus status;

    @Column(name = "rejc_reason", length = 500)
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    private Users user;

    @ManyToMany
    @JoinTable(
            name = "resource_booking",
            joinColumns = @JoinColumn(name = "BookingID"),
            inverseJoinColumns = @JoinColumn(name = "ResourceID")
    )
    @Builder.Default
    private List<Resource> resources = new ArrayList<>();

    @PrePersist
    public void setDefaultStatus() {
        if (status == null) {
            status = BookingStatus.PENDING;
        }
    }

    public enum BookingStatus {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }
}
