package com.smart.backend.BookingMgmt.service;

import com.smart.backend.BookingMgmt.dto.BookingRequestDTO;
import com.smart.backend.BookingMgmt.dto.BookingResponseDTO;
import com.smart.backend.BookingMgmt.model.Booking;
import com.smart.backend.BookingMgmt.model.Booking.BookingStatus;
import com.smart.backend.BookingMgmt.repo.BookingRepository;
import com.smart.backend.ResourceMgmt.model.Resource;
import com.smart.backend.ResourceMgmt.repo.ResourceRepository;
import com.smart.backend.authentication.entity.Role;
import com.smart.backend.authentication.entity.Users;
import com.smart.backend.authentication.repo.UserRepo;
import java.util.List;
import java.util.Objects;
import java.util.StringJoiner;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
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
        Users user = resolveAuthenticatedUser(authenticatedUsername);

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
    public List<BookingResponseDTO> getBookingsByUser(Long userId, String authenticatedUsername) {
        Users actor = resolveAuthenticatedUser(authenticatedUsername);
        boolean isAdmin = hasRole(actor, "Admin");
        boolean isSelf = userId.equals((long) actor.getUserId());

        if (!isAdmin && !isSelf) {
            throw new SecurityException("You are not allowed to view bookings for another user.");
        }

        return bookingRepository.findAll().stream()
                .filter(booking -> userId.equals((long) booking.getUser().getUserId()))
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsForAuthenticatedUser(String authenticatedUsername) {
        Users user = resolveAuthenticatedUser(authenticatedUsername);

        return getBookingsByUser((long) user.getUserId(), authenticatedUsername);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings(String authenticatedUsername) {
        return bookingRepository.findAll().stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId, String authenticatedUsername) {
        Users actor = resolveAuthenticatedUser(authenticatedUsername);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found with id: " + bookingId));

        boolean isAdmin = hasRole(actor, "Admin");
        boolean isOwner = booking.getUser() != null
                && Objects.equals(booking.getUser().getUserId(), actor.getUserId());

        // For QR verification flow, any authenticated user can validate approved bookings.
        if (booking.getStatus() == BookingStatus.APPROVED) {
            return toResponseDTO(booking);
        }

        if (!isAdmin && !isOwner) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to view this booking.");
        }

        return toResponseDTO(booking);
    }

    @Transactional
    public BookingResponseDTO updateBookingStatus(
            Long bookingId,
            BookingStatus newStatus,
            String rejectionReason,
            String authenticatedUsername
    ) {
        if (newStatus != BookingStatus.APPROVED && newStatus != BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Only APPROVED or REJECTED can be set through review workflow.");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be reviewed.");
        }

        if (newStatus == BookingStatus.REJECTED && (rejectionReason == null || rejectionReason.isBlank())) {
            throw new IllegalArgumentException("Rejection reason is required when status is REJECTED.");
        }

        booking.setStatus(newStatus);
        booking.setRejectionReason(newStatus == BookingStatus.REJECTED ? rejectionReason.trim() : null);

        Booking updated = bookingRepository.save(booking);
        return toResponseDTO(updated);
    }

    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, String authenticatedUsername) {
        Users actor = resolveAuthenticatedUser(authenticatedUsername);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + bookingId));

        boolean isAdmin = hasRole(actor, "Admin");
        boolean isOwner = booking.getUser() != null
            && Objects.equals(booking.getUser().getUserId(), actor.getUserId());

        if (!isAdmin && !isOwner) {
            throw new SecurityException("You are not allowed to cancel this booking.");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED bookings can be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setRejectionReason(null);

        Booking updated = bookingRepository.save(booking);
        return toResponseDTO(updated);
    }

    @Transactional
    public void deleteBooking(Long bookingId, String authenticatedUsername) {
        // Ensure caller is authenticated, but do not restrict delete to admin/owner for booking cleanup flows.
        resolveAuthenticatedUser(authenticatedUsername);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found with id: " + bookingId));

        BookingStatus status = booking.getStatus();
        if (status != BookingStatus.APPROVED && status != BookingStatus.REJECTED && status != BookingStatus.CANCELLED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only APPROVED, REJECTED, or CANCELLED bookings can be deleted."
            );
        }

        try {
            booking.getResources().clear();
            bookingRepository.saveAndFlush(booking);
            bookingRepository.delete(booking);
            bookingRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Booking cannot be deleted because it is referenced by other records."
            );
        }
    }

    private Users resolveAuthenticatedUser(String authenticatedUsername) {
        return userRepo.findByUserName(authenticatedUsername)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found: " + authenticatedUsername));
    }

    private void ensureAdmin(Users user) {
        if (!hasRole(user, "Admin")) {
            throw new SecurityException("Only ADMIN users are allowed for this action.");
        }
    }

    private boolean hasRole(Users user, String roleName) {
        return user.getRole() != null && user.getRole().stream()
                .filter(Objects::nonNull)
                .map(Role::getRoleName)
                .anyMatch(name -> roleName.equalsIgnoreCase(name));
    }

    private BookingResponseDTO toResponseDTO(Booking booking) {
        return new BookingResponseDTO(
                booking.getBookingId(),
                (long) booking.getUser().getUserId(),
                resolveUserDisplayName(booking.getUser()),
                booking.getResources().stream().map(Resource::getId).toList(),
                booking.getResources().stream().map(Resource::getName).toList(),
            booking.getResources().stream().map(Resource::getLocation).toList(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getRejectionReason()
        );
    }

    private String resolveUserDisplayName(Users user) {
        if (user == null) {
            return "Unknown User";
        }

        if (user.getUserName() != null && !user.getUserName().isBlank()) {
            return user.getUserName();
        }

        StringJoiner fullName = new StringJoiner(" ");
        if (user.getUserFirstName() != null && !user.getUserFirstName().isBlank()) {
            fullName.add(user.getUserFirstName().trim());
        }
        if (user.getUserLastName() != null && !user.getUserLastName().isBlank()) {
            fullName.add(user.getUserLastName().trim());
        }
        String fullNameValue = fullName.toString();
        if (!fullNameValue.isBlank()) {
            return fullNameValue;
        }

        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            return user.getEmail();
        }

        return "Unknown User";
    }
}
