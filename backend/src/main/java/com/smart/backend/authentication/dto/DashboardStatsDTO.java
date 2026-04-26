package com.smart.backend.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long availableFacilities;
    private long activeBookings;
    private long pendingTickets;
    private long newNotifications;
}
