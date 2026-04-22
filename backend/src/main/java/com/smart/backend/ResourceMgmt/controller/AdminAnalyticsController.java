package com.smart.backend.ResourceMgmt.controller;

import com.smart.backend.ResourceMgmt.service.AdminAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final AdminAnalyticsService service;

    public AdminAnalyticsController(AdminAnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/top-resources")
    public ResponseEntity<List<Map<String, Object>>> topResources(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(service.getTopResources(limit));
    }

    @GetMapping("/peak-hours")
    public ResponseEntity<Map<Integer, Long>> peakHours() {
        return ResponseEntity.ok(service.getPeakHours());
    }

    @GetMapping("/bookings-over-time")
    public ResponseEntity<List<Map<String, Object>>> bookingsOverTime(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(service.getBookingsOverTime(days));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats(
            @RequestParam(defaultValue = "10") int topLimit,
            @RequestParam(defaultValue = "30") int days
    ) {
        Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("topResources", service.getTopResources(topLimit));
        payload.put("peakHours", service.getPeakHours());
        payload.put("bookingsOverTime", service.getBookingsOverTime(days));
        payload.put("resourceUtilization", service.getResourceUtilization(days));
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/resource-utilization")
    public ResponseEntity<List<Map<String, Object>>> resourceUtilization(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(service.getResourceUtilization(days));
    }
}
