package com.smart.backend.BookingMgmt.model;

import jakarta.persistence.CollectionTable;
//import com.smart.backend.ResourceMgmt.model.Resource;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
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

    @Column(name = "UserID", nullable = false)
    private Long userId;

    //commenting out for now, will add back when we have the resource entity ready
    // @ManyToMany
    // @JoinTable(
    //         name = "Resource_Booking",
    //         joinColumns = @JoinColumn(name = "BookingID"),
    //         inverseJoinColumns = @JoinColumn(name = "ResourceID")
    // )
    // @Builder.Default
    // private List<Resource> resources = new ArrayList<>();

    //changing to a simple list of resource names for now, will switch back to the entity once we have it ready
    @ElementCollection
    @CollectionTable(
            name = "resource_booking",
            joinColumns = @JoinColumn(name = "BookingID")
    )
    @Column(name = "ResourceID")
    private List<Long> resourceIds;
    //end of temporary change

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
