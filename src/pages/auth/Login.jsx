import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Car, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // error handled by context toast
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setErrors({});
  };

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center lg:justify-between px-4 sm:px-8 lg:px-16 py-8 relative overflow-hidden bg-slate-950">
      {/* Background Car Image (Local High-Res Asset - Fast & 100% Reliable) */}
      <img
        src="/auth-bg.jpg"
        alt="Luxury Car Fleet"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
      />

      {/* Balanced Atmospheric Overlays - Keeps the vehicle vividly visible */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[0.5px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/50 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/70 pointer-events-none z-0" />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Left hero showcase on large screens */}
      <div className="hidden lg:flex flex-col justify-center max-w-xl relative z-10 space-y-6 my-auto pr-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md w-fit shadow-lg">
          <Sparkles className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
            Luxury & Performance Fleet
          </span>
        </div>

        <div>
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Drive the <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">Extraordinary</span>.
          </h1>
          <p className="mt-3 text-base text-slate-200 max-w-md leading-relaxed drop-shadow-sm">
            Experience premium car rentals with instant booking, zero hidden fees, and transparent pricing in Indian Rupees.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950/75 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-black text-white">50+</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Premium Cars</div>
          </div>
          <div className="bg-slate-950/75 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Verified Fleet</div>
          </div>
          <div className="bg-slate-950/75 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-lg">
            <div className="text-2xl font-black text-white">24/7</div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">Roadside Care</div>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-950/85 backdrop-blur-2xl border border-white/15 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/90 ring-1 ring-white/10 my-auto">
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 mb-4">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
            Velocity<span className="text-red-500 font-extrabold">Drive</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your car rental fleet dashboard
          </p>
        </div>

        {/* 1-Click Demo Fill Banner */}
        <div className="mb-6 p-3.5 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400 shrink-0" />
            <div className="text-left text-xs">
              <span className="font-semibold text-red-200 block">Quick Demo Access</span>
              <span className="text-[11px] text-slate-400">{DEMO_CREDENTIALS.email}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@carrental.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-red-500 focus:ring-red-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
