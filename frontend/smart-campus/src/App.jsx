import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Tickets from './ticketMgmt/pages/Tickets';
import SignUp from './authentication/pages/SignUp';
import SignIn from './authentication/pages/SignIn';
import OAuth2Callback from './authentication/pages/OAuth2Callback';
import Profile from './authentication/pages/Profile';
import ForgotPassword from './authentication/pages/ForgotPassword';

import BookingPage from './bookings/pages/BookingPage';
import Bookings from './bookings/pages/Bookings';
import AdminBookingsPage from './bookings/pages/AdminBookingsPage';
import BookingVerificationPage from './bookings/pages/BookingVerificationPage';
import ResourcesPage from './resourceMgmt/pages/ResourcesPage';
import ResourceDetailsPage from './resourceMgmt/pages/ResourceDetailsPage';
import ResourceCreatePage from './resourceMgmt/pages/ResourceCreatePage';
import ResourceEditPage from './resourceMgmt/pages/ResourceEditPage';



function App() {
  return (
    <Router>
      <Routes>
        {/* Public / Auth routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />

        {/* Protected / Layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-bookings" element={<AdminBookingsPage />} />

          {/* Resource Management (merged from feature branch) */}
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          <Route path="/resources/create" element={<ResourceCreatePage />} />
          <Route path="/resources/edit/:id" element={<ResourceEditPage />} />
        </Route>

        {/* Booking routes */}
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/my-bookings" element={<Bookings />} />
        <Route path="/verify/:id" element={<BookingVerificationPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;