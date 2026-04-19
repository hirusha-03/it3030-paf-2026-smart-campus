import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Home from './pages/Home';
import Tickets from './ticketMgmt/pages/Tickets';
import SignUp from './authentication/pages/SignUp';
import SignIn from './authentication/pages/SignIn';
import OAuth2Callback from './authentication/pages/OAuth2Callback';
import Profile from './authentication/pages/Profile';  // ✅ Import Profile

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin"          element={<SignIn />} />
        <Route path="/signup"          element={<SignUp />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />

        <Route element={<MainLayout />}>
          <Route path="/dsf"     element={<Home />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/profile" element={<Profile />} />  
        </Route>

      </Routes>
    </Router>
  );
}

export default App;