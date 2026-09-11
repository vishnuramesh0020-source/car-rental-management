import { useState } from 'react';
import { X, User, Mail } from 'lucide-react';
import { useCars } from '../../context/CarContext';

export const RentModal = ({ isOpen, onClose, car }) => {
  const { addBooking } = useCars();
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Default dates: tomorrow to +4 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(tomorrow);
  nextWeek.setDate(nextWeek.getDate() + 4);

  const [startDate, setStartDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(nextWeek.toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  if (!isOpen || !car) return null;

  // Calculate rental duration & price
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end - start);
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalCost = diffDays * (Number(car.pricePerDay) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!customerName.trim()) errs.name = 'Full name is required';
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      errs.email = 'Valid email address is required';
    }
    if (new Date(startDate) > new Date(endDate)) {
      errs.date = 'End date cannot be earlier than start date';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await addBooking({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        carId: car.id,
        carName: `${car.brand} ${car.model}`,
        startDate,
        endDate,
        totalDays: diffDays,
        totalAmount: totalCost,
        status: 'Active',
      });
      onClose();
    } catch {
      // toast shown by context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={!submitting ? onClose : undefined}
      />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Booking Reservation
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            Rent {car.brand} {car.model}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Fill in the customer details and rental duration to generate a confirmed rental contract.
          </p>
        </div>

        {/* Selected Vehicle Mini Card */}
        <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3.5">
          <img
            src={car.image}
            alt={car.model}
            className="w-16 h-12 object-cover rounded-xl shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {car.brand} {car.model} ({car.year})
            </h4>
            <p className="text-[11px] text-slate-500">
              {car.transmission} • {car.fuelType} • {car.seatingCapacity} seats
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-black text-slate-900">₹{car.pricePerDay}</span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">/day</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Customer Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Eleanor Vance"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 ${
                  errors.name
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. eleanor@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pick-up Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
          </div>
          {errors.date && (
            <p className="text-xs text-rose-600 font-medium">{errors.date}</p>
          )}

          {/* Pricing summary */}
          <div className="p-4 bg-red-50/70 rounded-2xl border border-red-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-600 block">
                Total Calculation ({diffDays} {diffDays === 1 ? 'day' : 'days'})
              </span>
              <span className="text-[11px] text-slate-500">
                ₹{car.pricePerDay} × {diffDays} days + taxes included
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-red-700">
                ₹{totalCost}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 rounded-xl transition-all flex items-center gap-2"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>Confirm Rental</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
