package com.smart.backend.BookingMgmt.dto;

import com.smart.backend.BookingMgmt.model.Booking.BookingStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {

    private Long bookingId;
    private Long userId;
    private String userName;
    private List<Long> resourceIds;
    private List<String> resourceNames;
    private List<String> resourceLocations;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String rejectionReason;
}
