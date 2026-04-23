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
import MyBookingsPage from './bookings/pages/Bookings';
import AdminBookingsPage from './bookings/pages/AdminBookingsPage';
import BookingVerificationPage from './bookings/pages/BookingVerificationPage';
import ResourcesPage from './resourceMgmt/pages/ResourcesPage';
import ResourceDetailsPage from './resourceMgmt/pages/ResourceDetailsPage';
import ResourceCreatePage from './resourceMgmt/pages/ResourceCreatePage';
import ResourceEditPage from './resourceMgmt/pages/ResourceEditPage';
import Analytics from './pages/Analytics';

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const normalizedToken = token.startsWith('Bearer ') ? token.slice(7) : token;
  const tokenParts = normalizedToken.split('.');
  if (tokenParts.length < 2) {
    return null;
  }

  try {
    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64 + '='.repeat((4 - (base64.length % 4 || 4)) % 4);
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function getStoredRoles() {
  const rawUser = localStorage.getItem('user');
  if (rawUser) {
    try {
      const parsedUser = JSON.parse(rawUser);
      if (Array.isArray(parsedUser?.roles)) {
        return parsedUser.roles;
      }
      if (typeof parsedUser?.roles === 'string' && parsedUser.roles.trim()) {
        return [parsedUser.roles.trim()];
      }
    } catch {
      // Ignore invalid user JSON and continue with token fallback.
    }
  }

  const rawToken =
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('JwtToken');
  const decoded = decodeJwtPayload(rawToken);
  const tokenRoles = decoded?.roles;

  if (Array.isArray(tokenRoles)) {
    return tokenRoles;
  }
  if (typeof tokenRoles === 'string' && tokenRoles.trim()) {
    return [tokenRoles.trim()];
  }

  return [];
}

function App() {
  const roles = getStoredRoles();
  const normalizedRoles = Array.isArray(roles)
    ? roles
      .map((role) => (typeof role === 'string' ? role.replace('ROLE_', '').trim() : ''))
      .filter(Boolean)
    : [];
  const normalizedLowerRoles = normalizedRoles.map((role) => role.toLowerCase());
  const isAdmin = normalizedLowerRoles?.includes('admin');

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
          <Route
            path="/dashboard/bookings"
            element={isAdmin ? <AdminBookingsPage /> : <MyBookingsPage hideNavbar hideFooter />}
          />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-bookings" element={isAdmin ? <AdminBookingsPage /> : <Navigate to="/dashboard/bookings" replace />} />

          {/* Resource Management (merged from feature branch) */}
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          <Route path="/resources/create" element={<ResourceCreatePage />} />
          <Route path="/resources/edit/:id" element={<ResourceEditPage />} />

          {/* Analytics */}
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* Booking routes */}
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/verify/:id" element={<BookingVerificationPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;