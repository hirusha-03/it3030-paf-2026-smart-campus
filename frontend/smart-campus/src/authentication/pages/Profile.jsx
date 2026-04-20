import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  UserCircle, Mail, Phone, User, Shield,
  CalendarRange, Ticket, LogOut
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // No token — redirect to signin immediately
    if (!token) {
      navigate("/signin");
      return;
    }

    // Debug — remove after fixing
    console.log("Token found:", token);

    fetchUserProfile(token);
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      console.log("Calling /api/v1/user/me with token:", token);

      const res = await axios.get("http://localhost:8080/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("Profile response:", res.data);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

    } catch (err) {
      console.error("Profile fetch error:", err.response?.status, err.response?.data);

      // Token expired or invalid — redirect to signin
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
        return;
      }

      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/v1/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/signin");
    }
  };

  const getInitials = () => {
    if (!user) return 'U';
    const f = user.userFirstName?.[0] || '';
    const l = user.userLastName?.[0]  || '';
    return (f + l).toUpperCase() || user.userName?.[0]?.toUpperCase() || 'U';
  };

  const getFullName = () => {
    if (!user) return '';
    if (user.userFirstName && user.userLastName)
      return `${user.userFirstName} ${user.userLastName}`;
    return user.userFirstName || user.userName || '';
  };

  const getRole = () => {
    if (!user?.roles) return 'User';
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    return roles[0]?.replace('ROLE_', '') || 'User';
  };
  const isGoogleUser = () => user?.provider === "Google";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent
            rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => fetchUserProfile(localStorage.getItem("token"))}
            className="text-indigo-600 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-400 mt-1">View and manage your account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <span className="text-indigo-600 font-bold text-2xl">{getInitials()}</span>
          </div>

          <h2 className="text-base font-semibold text-slate-800">{getFullName()}</h2>
          <p className="text-sm text-slate-400 mt-1 mb-3">{user?.email}</p>

          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold
            uppercase tracking-wider rounded-full mb-6">
            {getRole()}
          </span>

          <div className="w-full h-px bg-slate-100 mb-5"></div>

          <div className="grid grid-cols-2 gap-3 w-full mb-5">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <CalendarRange size={14} className="text-indigo-400" />
                <span className="text-xs text-slate-400">Bookings</span>
              </div>
              <div className="text-lg font-semibold text-slate-800">—</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Ticket size={14} className="text-indigo-400" />
                <span className="text-xs text-slate-400">Tickets</span>
              </div>
              <div className="text-lg font-semibold text-slate-800">—</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-9 bg-red-50 hover:bg-red-100 border border-red-200
              text-red-600 rounded-xl text-sm font-medium flex items-center
              justify-center gap-2 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>

        {/* Right card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 pb-3 border-b border-slate-100">
            Personal information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <InfoField icon={<User size={14} />}       label="First name"      value={user?.userFirstName} />
            <InfoField icon={<User size={14} />}       label="Last name"       value={user?.userLastName} />
            <InfoField icon={<UserCircle size={14} />} label="Username"        value={user?.userName} />
            <InfoField icon={<Mail size={14} />}       label="Email"           value={user?.email} />
            <InfoField icon={<Phone size={14} />}      label="Contact number"  value={user?.contactNumber} />
            <InfoField icon={<Shield size={14} />}     label="Role"            value={getRole()} />
          </div>

          <h3 className="text-sm font-semibold text-slate-700 mb-4 pb-3 border-b border-slate-100">
            Account security
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoField
              icon={<Shield size={14} />}
              label="Password"
              value={isGoogleUser() ? null : '••••••••'}
              empty={isGoogleUser() ? 'Managed by Google' : null}
            />
            <InfoField
              icon={<UserCircle size={14} />}
              label="Login method"
              value={isGoogleUser() ? 'Google OAuth' : 'Standard'}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoField({ icon, label, value, empty }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-slate-400">{icon}</span>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      {value ? (
        <p className="text-sm text-slate-800 font-medium">{value}</p>
      ) : (
        <p className="text-sm text-slate-400 italic">{empty || 'Not provided'}</p>
      )}
    </div>
  );
}