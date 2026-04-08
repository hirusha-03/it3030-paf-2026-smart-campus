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

    @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            JOIN b.resourceIds r
            WHERE b.date = :date
              AND r = :resourceId
              AND b.startTime < :newEndTime
              AND b.endTime > :newStartTime
              AND b.status NOT IN :excludedStatuses
            """)
    boolean existsByDateAndResourceAndOverlappingTime(
            @Param("date") LocalDate date,
            @Param("resourceId") Long resourceId,
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
                resourceId,
                newStartTime,
                newEndTime,
                List.of(BookingStatus.CANCELLED, BookingStatus.REJECTED)
        );
    }
}
