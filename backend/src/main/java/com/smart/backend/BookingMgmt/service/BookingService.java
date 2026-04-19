package com.smart.backend.BookingMgmt.service;

import com.smart.backend.BookingMgmt.dto.BookingRequestDTO;
import com.smart.backend.BookingMgmt.dto.BookingResponseDTO;
import com.smart.backend.BookingMgmt.model.Booking;
import com.smart.backend.BookingMgmt.model.Booking.BookingStatus;
import com.smart.backend.BookingMgmt.repo.BookingRepository;
import com.smart.backend.ResourceMgmt.model.Resource;
import com.smart.backend.ResourceMgmt.repo.ResourceRepository;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepo userRepo;

    public BookingService(BookingRepository bookingRepository, ResourceRepository resourceRepository, UserRepo userRepo) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.userRepo = userRepo;
    }

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, String authenticatedUsername) {
        // Resolve the booking owner from JWT-authenticated principal.
        Users user = userRepo.findByUserName(authenticatedUsername)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found: " + authenticatedUsername));

        // Get the resource entities
        List<Resource> resources = resourceRepository.findAllById(request.getResourceIds());

        // Validate that all requested resources exist
        if (resources.size() != request.getResourceIds().size()) {
            throw new IllegalArgumentException("One or more resources not found");
        }

        // Check for conflicts with each resource
        for (Long resourceId : request.getResourceIds()) {
            boolean conflictExists = bookingRepository.existsByDateAndResourceAndOverlappingTime(
                    request.getDate(),
                    resourceId,
                    request.getStartTime(),
                    request.getEndTime()
            );

            if (conflictExists) {
                throw new IllegalArgumentException("Resource " + resourceId + " is already booked for this time.");
            }
        }

        Booking booking = Booking.builder()
                .user(user)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees() == null ? 0 : request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .rejectionReason(null)
                .resources(resources)
                .build();

        Booking saved = bookingRepository.save(booking);
        return toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findAll().stream()
                .filter(booking -> userId.equals((long) booking.getUser().getUserId()))
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public BookingResponseDTO updateBookingStatus(Long bookingId, BookingStatus newStatus, String rejectionReason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        if (newStatus == BookingStatus.REJECTED && (rejectionReason == null || rejectionReason.isBlank())) {
            throw new IllegalArgumentException("Rejection reason is required when status is REJECTED.");
        }

        booking.setStatus(newStatus);
        booking.setRejectionReason(newStatus == BookingStatus.REJECTED ? rejectionReason : null);

        Booking updated = bookingRepository.save(booking);
        return toResponseDTO(updated);
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Booking not found with id: " + bookingId);
        }

        bookingRepository.deleteById(bookingId);
    }

    private BookingResponseDTO toResponseDTO(Booking booking) {
        return new BookingResponseDTO(
                booking.getBookingId(),
                (long) booking.getUser().getUserId(),
                booking.getResources().stream().map(Resource::getId).toList(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getRejectionReason()
        );
    }
}
