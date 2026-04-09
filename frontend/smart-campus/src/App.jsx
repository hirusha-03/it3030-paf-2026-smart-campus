import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Bookings from './bookings/pages/Bookings';
import Tickets from './ticketMgmt/pages/Tickets';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
