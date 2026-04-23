package com.smart.backend.ResourceMgmt.service;

import com.smart.backend.BookingMgmt.model.Booking;
import com.smart.backend.BookingMgmt.repo.BookingRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class AdminAnalyticsService {

    private final BookingRepository bookingRepository;

    public AdminAnalyticsService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Map<String, Object>> getTopResources(int limit) {
        var page = PageRequest.of(0, Math.max(1, limit));
        List<Object[]> rows = bookingRepository.findTopResources(page);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> item = new HashMap<>();
            item.put("resourceId", row[0]);
            item.put("resourceName", row[1]);
            item.put("count", ((Number) row[2]).longValue());
            result.add(item);
        }
        return result;
    }

    public Map<Integer, Long> getPeakHours() {
        List<Object[]> rows = bookingRepository.countBookingsByStartHour();
        Map<Integer, Long> hours = new TreeMap<>();
        for (int i = 0; i < 24; i++) hours.put(i, 0L);
        for (Object[] row : rows) {
            Integer hour = ((Number) row[0]).intValue();
            Long cnt = ((Number) row[1]).longValue();
            hours.put(hour, cnt);
        }
        return hours;
    }

    public List<Map<String, Object>> getBookingsOverTime(int days) {
        if (days <= 0) days = 30;
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days - 1);

        List<Object[]> rows = bookingRepository.countBookingsByDateBetween(start, end);
        Map<LocalDate, Long> counts = new HashMap<>();
        for (Object[] row : rows) {
            LocalDate date = (LocalDate) row[0];
            Long cnt = ((Number) row[1]).longValue();
            counts.put(date, cnt);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate cursor = start;
        while (!cursor.isAfter(end)) {
            Map<String, Object> item = new HashMap<>();
            item.put("date", cursor.toString());
            item.put("count", counts.getOrDefault(cursor, 0L));
            result.add(item);
            cursor = cursor.plusDays(1);
        }
        return result;
    }

    public List<Map<String, Object>> getResourceUtilization(int days) {
        if (days <= 0) days = 30;
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days - 1);

        List<Booking> bookings = bookingRepository.findByDateBetween(start, end);

        // Map resourceId -> (name, bookedMinutes)
        Map<Long, Map<String, Object>> accum = new HashMap<>();

        for (Booking b : bookings) {
            if (b.getStatus() == null) continue;
            // consider only APPROVED bookings for utilization
            if (!b.getStatus().name().equalsIgnoreCase("APPROVED")) continue;

            LocalTime s = b.getStartTime();
            LocalTime e = b.getEndTime();
            long minutes = 0;
            if (s != null && e != null) {
                if (e.isBefore(s)) {
                    minutes = Duration.between(s, e.plusHours(24)).toMinutes();
                } else {
                    minutes = Duration.between(s, e).toMinutes();
                }
            }

            if (b.getResources() == null) continue;
            for (var r : b.getResources()) {
                Long id = r.getId();
                String name = r.getName();
                Map<String, Object> m = accum.computeIfAbsent(id, k -> {
                    Map<String, Object> x = new HashMap<>();
                    x.put("resourceId", id);
                    x.put("resourceName", name);
                    x.put("bookedMinutes", 0L);
                    return x;
                });
                long prev = (Long) m.get("bookedMinutes");
                m.put("bookedMinutes", prev + minutes);
            }
        }

        double totalPossibleMinutes = days * 24.0 * 60.0;
        List<Map<String, Object>> out = new ArrayList<>();
        for (Map<String, Object> v : accum.values()) {
            Map<String, Object> item = new HashMap<>();
            long booked = (Long) v.get("bookedMinutes");
            item.put("resourceId", v.get("resourceId"));
            item.put("resourceName", v.get("resourceName"));
            item.put("bookedHours", booked / 60.0);
            item.put("utilizationPercent", (booked / totalPossibleMinutes) * 100.0);
            out.add(item);
        }

        // sort desc by utilization
        out.sort((a, b) -> Double.compare((Double)b.get("utilizationPercent"), (Double)a.get("utilizationPercent")));

        return out;
    }
}
