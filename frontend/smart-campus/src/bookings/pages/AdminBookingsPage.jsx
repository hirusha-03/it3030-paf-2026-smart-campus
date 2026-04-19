import { useEffect, useMemo, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../api/bookingApi";
import BookingTable from "../components/BookingTable";
import ReviewModal from "../components/ReviewModal";

const FILTER_OPTIONS = ["All", "Pending", "Approved", "Rejected"];

function normalizeStatus(status) {
  if (typeof status !== "string") {
    return "PENDING";
  }

  return status.toUpperCase();
}

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const data = await getAllBookings();
        if (isMounted) {
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          const backendMessage =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Unable to load booking requests right now. Please try again.";
          setErrorMessage(backendMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const sorted = [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime || "00:00:00"}`).getTime();
      const dateB = new Date(`${b.date}T${b.startTime || "00:00:00"}`).getTime();
      return dateB - dateA;
    });

    if (filterStatus === "All") {
      return sorted;
    }

    const normalizedFilter = filterStatus.toUpperCase();
    return sorted.filter((booking) => normalizeStatus(booking.status) === normalizedFilter);
  }, [bookings, filterStatus]);

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const handleApprove = async (booking) => {
    setUpdating(true);
    setErrorMessage("");

    try {
      const updatedBooking = await updateBookingStatus(booking.bookingId, "APPROVED");
      setBookings((prev) => prev.map((item) => (
        item.bookingId === updatedBooking.bookingId ? updatedBooking : item
      )));
      closeModal();
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to approve this booking. Please try again.";
      setErrorMessage(backendMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (booking, rejectionReason) => {
    setUpdating(true);
    setErrorMessage("");

    try {
      const updatedBooking = await updateBookingStatus(booking.bookingId, "REJECTED", rejectionReason);
      setBookings((prev) => prev.map((item) => (
        item.bookingId === updatedBooking.bookingId ? updatedBooking : item
      )));
      closeModal();
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to reject this booking. Please try again.";
      setErrorMessage(backendMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-2 py-2 sm:px-4 sm:py-4">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Booking Management Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Review incoming booking requests, then approve or reject with reason.
          </p>
        </header>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_OPTIONS.map((option) => {
              const isActive = filterStatus === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilterStatus(option)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-600">Loading booking requests...</p>
          </div>
        ) : (
          <BookingTable bookings={filteredBookings} onReviewClick={handleReviewClick} />
        )}
      

      <ReviewModal
        booking={selectedBooking}
        isOpen={Boolean(selectedBooking)}
        onClose={closeModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {updating && (
        <div className="fixed bottom-4 right-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-lg">
          Updating booking status...
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPage;
