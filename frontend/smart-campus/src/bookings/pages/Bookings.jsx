import { useEffect, useMemo, useState } from 'react';
import { deleteBooking, getUserBookings } from '../api/bookingApi';
import BookingCard from '../components/BookingCard';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [cancelInProgressId, setCancelInProgressId] = useState(null);

  const userId = 1;

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const data = await getUserBookings(userId);
        if (isMounted) {
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          const backendMessage =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            'Unable to load bookings right now. Please try again.';
          setErrorMessage(backendMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime || '00:00:00'}`).getTime();
        const dateB = new Date(`${b.date}T${b.startTime || '00:00:00'}`).getTime();
        return dateB - dateA;
      }),
    [bookings],
  );

  const handleCancelBooking = async (bookingId) => {
    setErrorMessage('');
    setCancelInProgressId(bookingId);

    try {
      await deleteBooking(bookingId);
      setBookings((prev) => prev.filter((booking) => booking.bookingId !== bookingId));
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to cancel this booking right now. Please try again.';
      setErrorMessage(backendMessage);
    } finally {
      setCancelInProgressId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            My Bookings
          </h1>
          <p className="mt-2 text-base text-slate-600 sm:text-lg">
            Booking History
          </p>
        </header>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-600">Loading your bookings...</p>
          </div>
        ) : sortedBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">No bookings yet</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your confirmed and pending bookings will appear here.
            </p>
          </div>
        ) : (
          <section className="grid gap-4 sm:gap-5 lg:grid-cols-2">
            {sortedBookings.map((booking) => (
              <BookingCard
                key={booking.bookingId}
                booking={booking}
                onCancel={handleCancelBooking}
                isCancelling={cancelInProgressId === booking.bookingId}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Bookings;