import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// Password strength calculator 
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  const checks = {
    length:    password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[^a-zA-Z0-9]/.test(password),
  };

  score = Object.values(checks).filter(Boolean).length;

  const levels = [
    { min: 0, label: '',          color: '' },
    { min: 1, label: 'Very weak', color: 'bg-red-500' },
    { min: 2, label: 'Weak',      color: 'bg-orange-400' },
    { min: 3, label: 'Fair',      color: 'bg-amber-400' },
    { min: 4, label: 'Strong',    color: 'bg-blue-500' },
    { min: 5, label: 'Very strong', color: 'bg-green-500' },
  ];

  const level = levels[score] || levels[0];
  return { score, label: level.label, color: level.color, checks };
}

// Success Modal/Toast Component
function SuccessMessage({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
          <button onClick={onClose} className="text-green-600 hover:text-green-800">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// OTP Modal
function EmailOtpModal({ email, onVerified, onClose }) {
  const [otp, setOtp]       = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [timer, setTimer]   = useState(300);
  const intervalRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(300);
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5)
      document.getElementById(`sotp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`sotp-${index - 1}`)?.focus();
  };

  const handleResend = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/password/send-otp', { email });
      setOtp(['', '', '', '', '', '']);
      setError('');
      startTimer();
    } catch {
      setError('Failed to resend OTP.');
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { setError('Enter all 6 digits.'); return; }
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/v1/password/verify-otp', {
        email, otp: otpString
      });
      onVerified();
    } catch {
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 border border-gray-200">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center
          justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#4f46e5" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-1">
          Verify your email
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter the 6-digit code sent to<br />
          <span className="font-medium text-gray-600">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-center mb-5">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`sotp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-11 h-12 border border-gray-200 rounded-lg text-center
                text-xl font-semibold text-gray-800 outline-none
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
            rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
        >
          {loading ? 'Verifying...' : 'Verify email'}
        </button>

        <div className="text-center mt-3 space-y-1">
          {timer > 0 ? (
            <p className="text-xs text-gray-400">
              Expires in <span className="font-medium text-gray-600">{formatTimer()}</span>
            </p>
          ) : (
            <p className="text-xs text-red-500 font-medium">Code expired</p>
          )}
          <button
            onClick={handleResend}
            className="text-xs text-indigo-600 hover:underline"
          >
            Resend code
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full h-9 mt-3 border border-gray-200 rounded-lg text-sm
            text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Main SignUp Component
export function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userFirstName: '', userLastName: '',
    userName: '', email: '',
    contactNumber: '', userPassword: '',
    userRole: 'User',
  });

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  // Field-level validation states
  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle | checking | available | taken
  const [emailStatus,    setEmailStatus]    = useState('idle'); // idle | checking | available | taken | verified
  const [showOtpModal,   setShowOtpModal]   = useState(false);
  const [contactError,   setContactError]   = useState('');

  const strength = getPasswordStrength(form.userPassword);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "EMAIL_EXISTS") setError("This Google account is already registered. Please sign in.");
    if (err === "NO_ACCOUNT")   setError("No account found. Please sign up first.");
  }, []);

  // Debounced username check
  useEffect(() => {
    if (!form.userName || form.userName.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/user/check-username?username=${form.userName}`
        );
        setUsernameStatus(res.data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [form.userName]);

  // Debounced email existence check
  useEffect(() => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setEmailStatus('idle');
      return;
    }
    if (emailStatus === 'verified') return; // don't re-check after verify
    setEmailStatus('checking');
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/user/check-email?email=${form.email}`
        );
        setEmailStatus(res.data.available ? 'available' : 'taken');
      } catch {
        setEmailStatus('idle');
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [form.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Contact number — numbers only, max 10
  const handleContactChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm({ ...form, contactNumber: value });
    if (value && value.length < 10) {
      setContactError('Contact number must be 10 digits.');
    } else {
      setContactError('');
    }
  };

  // Send OTP for email verification
  const handleSendEmailOtp = async () => {
    if (emailStatus !== 'available') return;
    try {
      await axios.post(
        'http://localhost:8080/api/v1/password/verify-email/send-otp', 
        { email: form.email }
      );
      setShowOtpModal(true);
    } catch {
      setError('Failed to send OTP. Please try again.');
    }
  };

  // Form validation before submit
  const validate = () => {
    if (!form.userFirstName) return 'First name is required.';
    if (!form.userName)      return 'Username is required.';
    if (usernameStatus === 'taken') return 'Username is already taken.';
    if (usernameStatus === 'checking') return 'Please wait for username check.';
    if (!form.email)         return 'Email is required.';
    if (emailStatus === 'taken') return 'Email is already registered.';
    if (emailStatus !== 'verified') return 'Please verify your email first.';
    if (form.contactNumber.length !== 10) return 'Contact number must be 10 digits.';
    if (!form.userPassword)  return 'Password is required.';
    if (strength.score < 3)  return 'Password is too weak. Add uppercase, numbers and special characters.';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/v1/user/register-new-user', form);
      
      // Show success message
      setSuccessMessage('Account created successfully! 🎉 Redirecting to sign in...');
      
      // Redirect after 2 seconds to show success message
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      
    } catch {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google?mode=signup';
  };

  // Helper: status badge 
  const UsernameBadge = () => {
    if (usernameStatus === 'checking')  return <span className="text-xs text-gray-400">Checking...</span>;
    if (usernameStatus === 'available') return <span className="text-xs text-green-600 font-medium">✓ Available</span>;
    if (usernameStatus === 'taken')     return <span className="text-xs text-red-500 font-medium">✗ Already taken</span>;
    return null;
  };

  const EmailBadge = () => {
    if (emailStatus === 'checking')  return <span className="text-xs text-gray-400">Checking...</span>;
    if (emailStatus === 'taken')     return <span className="text-xs text-red-500 font-medium">✗ Already registered</span>;
    if (emailStatus === 'verified')  return <span className="text-xs text-green-600 font-medium">✓ Verified</span>;
    return null;
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animate-slide-in {
            animation: slideIn 0.3s ease-out;
          }
        `}
      </style>
      
      <div className="min-h-screen bg-gray-100 flex justify-center p-7 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-9 w-full max-w-md h-fit">

          {/* Brand */}
          <div className="flex items-center justify-center gap-2.5 mb-7">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BrandIcon />
            </div>
            <span className="text-lg font-medium text-gray-900">Smart Campus</span>
          </div>

          {/* Tabs */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-7">
            <button
              className="flex-1 h-9 text-gray-500 text-sm font-medium hover:bg-gray-50"
              onClick={() => navigate('/signin')}
            >
              Sign in
            </button>
            <button className="flex-1 h-9 bg-indigo-600 text-white text-sm font-medium">
              Sign up
            </button>
          </div>

          <h1 className="text-xl font-medium text-gray-900 mb-1">Create account</h1>
          <p className="text-sm text-gray-400 mb-7">Join Smart Campus today</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                First name
              </label>
              <input
                name="userFirstName"
                value={form.userFirstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm
                  outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                Last name
              </label>
              <input
                name="userLastName"
                value={form.userLastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm
                  outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Username with availability check */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Username
              </label>
              <UsernameBadge />
            </div>
            <input
              name="userName"
              type="text"
              value={form.userName}
              onChange={handleChange}
              placeholder="Choose a username"
              className={`w-full h-10 px-3 border rounded-lg text-sm outline-none
                focus:ring-2 focus:ring-indigo-100 transition-all
                ${usernameStatus === 'taken'
                  ? 'border-red-300 focus:border-red-400'
                  : usernameStatus === 'available'
                    ? 'border-green-300 focus:border-green-400'
                    : 'border-gray-200 focus:border-indigo-500'
                }`}
            />
          </div>

          {/* Email with existence check + OTP verify */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </label>
              <EmailBadge />
            </div>
            <div className="flex gap-2">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  handleChange(e);
                  setEmailStatus('idle'); // reset verified on change
                }}
                placeholder="john@university.edu"
                disabled={emailStatus === 'verified'}
                className={`flex-1 h-10 px-3 border rounded-lg text-sm outline-none
                  focus:ring-2 focus:ring-indigo-100 transition-all
                  ${emailStatus === 'taken'
                    ? 'border-red-300 focus:border-red-400'
                    : emailStatus === 'verified'
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-gray-200 focus:border-indigo-500'
                  }`}
              />
              {/* Verify button */}
              {emailStatus === 'available' && (
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  className="px-3 h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                    text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  Verify
                </button>
              )}
              {emailStatus === 'verified' && (
                <div className="px-3 h-10 bg-green-100 text-green-700 text-xs font-medium
                  rounded-lg flex items-center">
                  ✓ Done
                </div>
              )}
            </div>
            {emailStatus === 'available' && (
              <p className="text-xs text-indigo-500 mt-1">Click verify to confirm your email.</p>
            )}
          </div>

          {/* Contact number — numbers only, max 10 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Contact number
              </label>
              {form.contactNumber.length > 0 && (
                <span className={`text-xs font-medium ${
                  form.contactNumber.length === 10 ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {form.contactNumber.length}/10
                </span>
              )}
            </div>
            <input
              name="contactNumber"
              type="text"
              inputMode="numeric"
              value={form.contactNumber}
              onChange={handleContactChange}
              placeholder="0771234567"
              className={`w-full h-10 px-3 border rounded-lg text-sm outline-none
                focus:ring-2 focus:ring-indigo-100 transition-all
                ${contactError
                  ? 'border-red-300 focus:border-red-400'
                  : form.contactNumber.length === 10
                    ? 'border-green-300 focus:border-green-400'
                    : 'border-gray-200 focus:border-indigo-500'
                }`}
            />
            {contactError && (
              <p className="text-xs text-red-500 mt-1">{contactError}</p>
            )}
          </div>

          {/* Password with strength indicator */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              name="userPassword"
              type="password"
              value={form.userPassword}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm
                outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                transition-all mb-2"
            />

            {/* Strength bar */}
            {form.userPassword && (
              <>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                        level <= strength.score ? strength.color : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${
                    strength.score <= 1 ? 'text-red-500' :
                    strength.score === 2 ? 'text-orange-400' :
                    strength.score === 3 ? 'text-amber-500' :
                    strength.score === 4 ? 'text-blue-500' :
                    'text-green-600'
                  }`}>
                    {strength.label}
                  </span>
                </div>

                {/* Requirement checklist */}
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: 'length',    label: 'Min. 8 characters' },
                    { key: 'uppercase', label: 'Uppercase letter' },
                    { key: 'lowercase', label: 'Lowercase letter' },
                    { key: 'number',    label: 'Number' },
                    { key: 'special',   label: 'Special character' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center
                        flex-shrink-0 transition-colors ${
                          strength.checks?.[key]
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}>
                        {strength.checks?.[key] && (
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs ${
                        strength.checks?.[key] ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
              rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full h-10 border border-gray-200 rounded-lg text-sm
              text-gray-700 flex items-center justify-center gap-2
              hover:bg-gray-50 transition-colors"
          >
            <GoogleIcon />
            Sign up with Google
          </button>

          <p className="text-center mt-5 text-sm text-gray-400">
            Already have an account?{' '}
            <span
              className="text-indigo-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate('/signin')}
            >
              Sign in
            </span>
          </p>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <EmailOtpModal
            email={form.email}
            onVerified={() => {
              setEmailStatus('verified');
              setShowOtpModal(false);
            }}
            onClose={() => setShowOtpModal(false)}
          />
        )}

        {/* Success Message */}
        {successMessage && (
          <SuccessMessage 
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        )}
      </div>
    </>
  );
}

export default SignUp;