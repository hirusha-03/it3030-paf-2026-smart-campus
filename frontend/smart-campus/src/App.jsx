import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Tickets from './ticketMgmt/pages/Tickets';
import SignUp from './authentication/pages/SignUp';
import SignIn from './authentication/pages/SignIn';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
       
        <Route element={<MainLayout />}>
          <Route path="/dsf" element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;