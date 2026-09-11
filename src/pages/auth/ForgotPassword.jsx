import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch {
      // error toast handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-slate-950">
      {/* Background Car Image (Local High-Res Asset) */}
      <img
        src="/auth-bg.jpg"
        alt="Luxury Car Fleet"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
      />

      {/* Balanced Atmospheric Overlays */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[0.5px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/50 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/70 pointer-events-none z-0" />

      {/* Background ambient light */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md bg-slate-950/85 backdrop-blur-2xl border border-white/15 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/90 ring-1 ring-white/10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 mb-4">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
            Reset Password
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            We will send you instructions to reset your account password
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto ring-1 ring-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Check your inbox</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              We have dispatched a password recovery link to{' '}
              <strong className="text-red-400">{email}</strong>. Please check your spam folder if it doesn't appear within 2 minutes.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@carrental.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                    error
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                  }`}
                />
              </div>
              {error && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
