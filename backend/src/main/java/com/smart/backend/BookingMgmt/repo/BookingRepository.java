package com.smart.backend.BookingMgmt.repo;

import com.smart.backend.BookingMgmt.model.Booking;
import com.smart.backend.BookingMgmt.model.Booking.BookingStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings that reference a given resource id
    java.util.List<Booking> findByResources_Id(Long resourceId);


    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            JOIN b.resources r
            WHERE b.date = :date
              AND r.id IN :resourceIds
              AND b.startTime < :newEndTime
              AND b.endTime > :newStartTime
              AND b.status NOT IN :excludedStatuses
            """)
    boolean existsByDateAndResourceAndOverlappingTime(
            @Param("date") LocalDate date,
            @Param("resourceIds") List<Long> resourceIds,
            @Param("newStartTime") LocalTime newStartTime,
            @Param("newEndTime") LocalTime newEndTime,
            @Param("excludedStatuses") List<BookingStatus> excludedStatuses
    );

    default boolean existsByDateAndResourceAndOverlappingTime(
            LocalDate date,
            Long resourceId,
            LocalTime newStartTime,
            LocalTime newEndTime
    ) {
        return existsByDateAndResourceAndOverlappingTime(
                date,
                List.of(resourceId),
                newStartTime,
                newEndTime,
                List.of(BookingStatus.CANCELLED, BookingStatus.REJECTED)
        );
    }
}
