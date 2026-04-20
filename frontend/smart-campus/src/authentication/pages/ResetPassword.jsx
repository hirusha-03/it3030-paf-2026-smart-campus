import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ShieldCheck, CheckCircle } from 'lucide-react';

const STEPS = { NOTICE: 1, OTP: 2, NEW_PASSWORD: 3, SUCCESS: 4 };

export function ResetPassword({ userEmail, onClose }) {
  const navigate   = useNavigate();
  const [step, setStep]           = useState(STEPS.NOTICE);
  const [otp, setOtp]             = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [timer, setTimer]         = useState(300);

  //Start countdown timer
  const startTimer = () => {
    setTimer(300);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  //Step 1 — Send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/v1/password/send-otp', {
        email: userEmail
      });
      setStep(STEPS.OTP);
      startTimer();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  //OTP input handler
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  //Step 2 — Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/v1/password/verify-otp', {
        email: userEmail,
        otp: otpString
      });
      setStep(STEPS.NEW_PASSWORD);
    } catch (err) {
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //Step 3 — Reset Password
  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/v1/password/reset', {
        email:       userEmail,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 border border-slate-200">

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors ${
                step >= s ? 'bg-indigo-600' : 'bg-slate-200'
              }`} />
              {s < 3 && <div className="w-6 h-px bg-slate-200" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Notice */}
        {step === STEPS.NOTICE && (
          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center
              justify-center mx-auto mb-4">
              <Lock size={22} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 text-center mb-2">
              Reset your password
            </h2>
            <p className="text-sm text-slate-400 text-center mb-5">
              We'll send a one-time code to your registered email address.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
              <p className="text-sm text-blue-700 leading-relaxed">
                An OTP will be sent to <strong>{userEmail}</strong>.
                The code expires in <strong>5 minutes</strong>.
              </p>
            </div>

            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Registered email
            </label>
            <div className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg
              text-sm text-slate-500 flex items-center mb-5">
              {userEmail}
            </div>

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <button
              onClick={onClose}
              className="w-full h-9 mt-2 border border-slate-200 rounded-xl text-sm
                text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Step 2 — OTP Input */}
        {step === STEPS.OTP && (
          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center
              justify-center mx-auto mb-4">
              <Mail size={22} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 text-center mb-2">
              Check your email
            </h2>
            <p className="text-sm text-slate-400 text-center mb-6">
              Enter the 6-digit code sent to<br />
              <span className="font-medium text-slate-600">{userEmail}</span>
            </p>

            {/* OTP boxes */}
            <div className="flex gap-2 justify-center mb-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-11 h-12 border border-slate-200 rounded-lg text-center
                    text-xl font-semibold text-slate-800 outline-none
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                    transition-all"
                />
              ))}
            </div>

            {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length !== 6}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center mt-3">
              {timer > 0 ? (
                <p className="text-xs text-slate-400">
                  Code expires in <span className="font-medium text-slate-600">
                    {formatTimer()}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-red-500">Code expired.</p>
              )}
              <button
                onClick={handleSendOtp}
                className="text-xs text-indigo-600 mt-1 hover:underline"
              >
                Resend code
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — New Password */}
        {step === STEPS.NEW_PASSWORD && (
          <div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center
              justify-center mx-auto mb-4">
              <ShieldCheck size={22} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 text-center mb-2">
              Set new password
            </h2>
            <p className="text-sm text-slate-400 text-center mb-6">
              Choose a strong password for your account.
            </p>

            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm
                text-slate-800 outline-none focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-100 mb-4 transition-all"
            />

            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm
                text-slate-800 outline-none focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-100 mb-5 transition-all"
            />

            {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === STEPS.SUCCESS && (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center
              justify-center mx-auto mb-4">
              <CheckCircle size={22} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Password updated!
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Your password has been changed successfully. Please sign in again.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/signin');
              }}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-xl text-sm font-medium transition-colors"
            >
              Go to sign in
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ResetPassword;