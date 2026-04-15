import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", userPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/authentication", form
      );
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google?mode=signin";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-9 w-full max-w-md">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BrandIcon />
          </div>
          <span className="text-lg font-medium text-gray-900">Smart Campus</span>
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
          <button className="flex-1 h-9 bg-indigo-600 text-white text-sm font-medium">
            Sign in
          </button>
          <button
            className="flex-1 h-9 text-gray-500 text-sm font-medium hover:bg-gray-50"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>

        <h1 className="text-xl font-medium text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">
          Sign in to your Smart Campus account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
            Username
          </label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm
              text-gray-900 outline-none focus:border-indigo-500 focus:ring-2
              focus:ring-indigo-100 transition-all"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <input
            name="userPassword"
            type="password"
            value={form.userPassword}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm
              text-gray-900 outline-none focus:border-indigo-500 focus:ring-2
              focus:ring-indigo-100 transition-all"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
            rounded-lg text-sm font-medium mt-1 transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-10 border border-gray-200 rounded-lg text-sm
            text-gray-700 flex items-center justify-center gap-2
            hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <p className="text-center mt-5 text-sm text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export function BrandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" opacity="0.9"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" opacity="0.3"/>
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default SignIn