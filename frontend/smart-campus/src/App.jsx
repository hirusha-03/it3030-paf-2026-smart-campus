import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Tickets from './ticketMgmt/pages/Tickets';
import SignUp from './authentication/pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<SignUp />} />
       
        <Route element={<MainLayout />}>
          <Route path="/dsf" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;