import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Tickets from './ticketMgmt/pages/Tickets';
import BookingPage from './bookings/pages/BookingPage';
import ResourcesPage from './resourceMgmt/pages/ResourcesPage';
import ResourceDetailsPage from './resourceMgmt/pages/ResourceDetailsPage';
import ResourceCreatePage from './resourceMgmt/pages/ResourceCreatePage';
import ResourceEditPage from './resourceMgmt/pages/ResourceEditPage';

// Temporary - will be replaced by actual auth
const isAdmin = true; // Set based on user role from auth

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={(
            <MainLayout>
              <Home />
            </MainLayout>
          )}
        />
        <Route
          path="/tickets"
          element={(
            <MainLayout>
              <Tickets />
            </MainLayout>
          )}
        />
        <Route
          path="/bookings"
          element={<BookingPage />}
        />
        <Route
          path="/resources"
          element={
            <MainLayout>
              <ResourcesPage isAdmin={isAdmin} />
            </MainLayout>
          }
        />
        <Route
          path="/resources/:id"
          element={
            <MainLayout>
              <ResourceDetailsPage isAdmin={isAdmin} />
            </MainLayout>
          }
        />
        <Route
          path="/resources/create"
          element={
            <MainLayout>
              <ResourceCreatePage />
            </MainLayout>
          }
        />
        <Route
          path="/resources/edit/:id"
          element={
            <MainLayout>
              <ResourceEditPage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
