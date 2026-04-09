import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Tickets from './ticketMgmt/pages/Tickets';

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
      </Routes>
    </Router>
  );
}

export default App;
