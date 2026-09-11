import { useState } from 'react';
import { Menu, Bell, LogOut, Car, KeyRound, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const Navbar = ({ onOpenSidebar, onOpenAddCar, onOpenBookRental }) => {
  const { user, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
            Car Rental Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1 hidden sm:block">
            Management & Operations Dashboard
          </p>
        </div>
      </div>

      {/* Right side: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Book Rental Button */}
        <button
          type="button"
          onClick={onOpenBookRental}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors shadow-xs"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>+ Book Rental</span>
        </button>

        {/* Quick Add Car Button */}
        <button
          type="button"
          onClick={onOpenAddCar}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200/60"
        >
          <Car className="w-3.5 h-3.5" />
          <span>+ Add Car</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserDropdownOpen(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications Flyout */}
          {notificationsOpen && (
            <div 
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-left"
              onMouseLeave={() => setNotificationsOpen(false)}
            >
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications (2)
                </span>
                <span className="text-[11px] text-red-600 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-2.5 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-semibold text-slate-800">New Booking Confirmed</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Alexander Wright reserved Mercedes-Benz C300 for 6 days.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15 minutes ago</span>
                </div>
                <div className="px-4 py-2.5 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-semibold text-slate-800">Fleet Inspection Complete</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tesla Model 3 scheduled maintenance completed.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500/20"
            />
            <div className="text-left hidden md:block">
              <span className="text-xs font-semibold text-slate-900 block leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">
                {user?.role || 'Fleet Manager'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Dropdown */}
          {userDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-left"
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/cars"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Car Fleet</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
