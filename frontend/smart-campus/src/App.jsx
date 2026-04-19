import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Tickets from './ticketMgmt/pages/Tickets';
import BookingPage from './bookings/pages/BookingPage';
import Bookings from './bookings/pages/Bookings';

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
          path="/my-bookings"
          element={<Bookings />}
        />
      </Routes>
    </Router>
  );
}

export default App;
