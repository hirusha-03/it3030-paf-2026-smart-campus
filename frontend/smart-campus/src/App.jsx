import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Tickets from './ticketMgmt/pages/Tickets';
import SignUp from './authentication/pages/SignUp';
import SignIn from './authentication/pages/SignIn';
import OAuth2Callback from './authentication/pages/OAuth2Callback';
import Profile from './authentication/pages/Profile';

import BookingPage from './bookings/pages/BookingPage';
import Bookings from './bookings/pages/Bookings';
import AdminBookingsPage from './bookings/pages/AdminBookingsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public / Auth routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />

        {/* Protected / Layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-bookings" element={<AdminBookingsPage />} />
        </Route>

        {/* Booking routes (outside layout if needed) */}
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/my-bookings" element={<Bookings />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;