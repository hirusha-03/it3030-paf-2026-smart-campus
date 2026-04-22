import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';
import { BrandIcon } from './SignIn';

const STEPS = { EMAIL: 1, OTP: 2, NEW_PASSWORD: 3, SUCCESS: 4 };

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep]                   = useState(STEPS.EMAIL);
  const [email, setEmail]                 = useState('');
  const [otp, setOtp]                     = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [timer, setTimer]                 = useState(300);

  // Countdown timer
  const startTimer = () => {
    setTimer(300);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return interval;
  };

  const formatTimer = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Step 1 — Send OTP to entered email
  const handleSendOtp = async () => {
    if (!email) { setError('Please enter your email.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/v1/password/send-otp', { email });
      setStep(STEPS.OTP);
      startTimer();
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`fotp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`fotp-${index - 1}`)?.focus();
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { setError('Please enter all 6 digits.'); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/v1/password/verify-otp', {
        email,
        otp: otpString
      });
      setStep(STEPS.NEW_PASSWORD);
    } catch (err) {
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — Reset Password
  const handleResetPassword = async () => {
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/v1/password/reset', {
        email,
        otp:         otp.join(''),
        newPassword: newPassword
      });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-9 w-full max-w-md">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BrandIcon />
          </div>
          <span className="text-lg font-medium text-gray-900">Smart Campus</span>
        </div>

        {/* Progress bar */}
        {step !== STEPS.SUCCESS && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  step >= s ? 'bg-indigo-600 scale-125' : 'bg-gray-200'
                }`} />
                {s < 3 && <div className={`w-8 h-px transition-colors ${
                  step > s ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 — Enter Email */}
        {step === STEPS.EMAIL && (
          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center
              justify-center mx-auto mb-4">
              <Mail size={22} className="text-indigo-600" />
            </div>

            <h1 className="text-xl font-medium text-gray-900 text-center mb-2">
              Forgot password?
            </h1>
            <p className="text-sm text-gray-400 text-center mb-6">
              Enter your registered email and we'll send you a one-time code to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
              placeholder="Enter your registered email"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm
                text-gray-900 outline-none focus:border-indigo-500 focus:ring-2
                focus:ring-indigo-100 transition-all mb-5"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <button
              onClick={() => navigate('/signin')}
              className="w-full h-9 mt-2 border border-gray-200 rounded-lg text-sm
                text-gray-500 hover:bg-gray-50 transition-colors flex items-center
                justify-center gap-2"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </button>
          </div>
        )}

        {/* Step 2 — Enter OTP */}
        {step === STEPS.OTP && (
          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center
              justify-center mx-auto mb-4">
              <Mail size={22} className="text-indigo-600" />
            </div>

            <h1 className="text-xl font-medium text-gray-900 text-center mb-2">
              Check your email
            </h1>
            <p className="text-sm text-gray-400 text-center mb-6">
              Enter the 6-digit code sent to<br />
              <span className="font-medium text-gray-600">{email}</span>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* OTP boxes */}
            <div className="flex gap-2 justify-center mb-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`fotp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-12 border border-gray-200 rounded-lg text-center
                    text-xl font-semibold text-gray-800 outline-none
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                    transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length !== 6}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center mt-3 space-y-1">
              {timer > 0 ? (
                <p className="text-xs text-gray-400">
                  Code expires in{' '}
                  <span className="font-medium text-gray-600">{formatTimer()}</span>
                </p>
              ) : (
                <p className="text-xs text-red-500 font-medium">Code expired</p>
              )}
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="text-xs text-indigo-600 hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            </div>

            <button
              onClick={() => { setStep(STEPS.EMAIL); setError(''); setOtp(['','','','','','']); }}
              className="w-full h-9 mt-3 border border-gray-200 rounded-lg text-sm
                text-gray-500 hover:bg-gray-50 transition-colors flex items-center
                justify-center gap-2"
            >
              <ArrowLeft size={14} />
              Change email
            </button>
          </div>
        )}

        {/* Step 3 — New Password */}
        {step === STEPS.NEW_PASSWORD && (
          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center
              justify-center mx-auto mb-4">
              <ShieldCheck size={22} className="text-indigo-600" />
            </div>

            <h1 className="text-xl font-medium text-gray-900 text-center mb-2">
              Set new password
            </h1>
            <p className="text-sm text-gray-400 text-center mb-6">
              Choose a strong password for your account.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm
                text-gray-900 outline-none focus:border-indigo-500 focus:ring-2
                focus:ring-indigo-100 transition-all mb-4"
            />

            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
              placeholder="Repeat new password"
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm
                text-gray-900 outline-none focus:border-indigo-500 focus:ring-2
                focus:ring-indigo-100 transition-all mb-5"
            />

            {/* Password strength indicator */}
            <div className="flex gap-1 mb-5">
              {[1, 2, 3, 4].map((level) => (
                <div key={level} className={`flex-1 h-1 rounded-full transition-colors ${
                  newPassword.length === 0 ? 'bg-gray-100' :
                  newPassword.length < 6   ? (level <= 1 ? 'bg-red-400' : 'bg-gray-100') :
                  newPassword.length < 8   ? (level <= 2 ? 'bg-amber-400' : 'bg-gray-100') :
                  newPassword.length < 12  ? (level <= 3 ? 'bg-blue-400' : 'bg-gray-100') :
                  'bg-green-400'
                }`} />
              ))}
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === STEPS.SUCCESS && (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center
              justify-center mx-auto mb-5">
              <CheckCircle size={28} className="text-green-600" />
            </div>

            <h1 className="text-xl font-medium text-gray-900 mb-2">
              Password updated!
            </h1>
            <p className="text-sm text-gray-400 mb-7">
              Your password has been reset successfully.
              You can now sign in with your new password.
            </p>

            <button
              onClick={() => navigate('/signin')}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-lg text-sm font-medium transition-colors"
            >
              Go to sign in
            </button>
          </div>
        )}

      </div>
    </div>
  );
}