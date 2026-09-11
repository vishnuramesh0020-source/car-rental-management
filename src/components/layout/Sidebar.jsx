import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  PlusCircle, 
  LogOut, 
  X,
  ShieldCheck,
  Users,
  CalendarCheck,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose, onOpenAddCar, onOpenBookRental }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cars', label: 'Fleet Management', icon: Car },
    { to: '/customers', label: 'Customer Directory', icon: Users },
    { to: '/bookings', label: 'Rental Bookings', icon: CalendarCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white text-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } border-r border-slate-200/80`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-200/80 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/25">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                Velocity<span className="text-red-600 font-extrabold">Drive</span>
              </span>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5">Car Rental System</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 overflow-y-auto space-y-6">
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Main Menu
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/25 font-semibold'
                          : 'text-slate-600 hover:text-red-600 hover:bg-red-50/80'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Quick Operations
            </p>
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                if (onOpenBookRental) onOpenBookRental();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <KeyRound className="w-4 h-4" />
              <span>Book Rental</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                if (onOpenAddCar) onOpenAddCar();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Add New Vehicle</span>
            </button>
          </div>

        </div>

        {/* User Session & Logout Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/20 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate flex items-center gap-1">
                  {user?.name || 'Manager'}
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 inline shrink-0" />
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
