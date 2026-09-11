import { X, Calendar, User, Phone, Mail, FileCheck, CheckCircle2, Ban, Car, IndianRupee, ShieldCheck } from 'lucide-react';
import { useCars } from '../../context/CarContext';

export const BookingDetailModal = ({
  isOpen,
  onClose,
  booking = null,
}) => {
  const { cars, updateBookingStatus } = useCars();

  if (!isOpen || !booking) return null;

  const car = cars.find((c) => String(c.id) === String(booking.carId));

  const handleStatusChange = async (newStatus) => {
    try {
      await updateBookingStatus(booking.id, newStatus);
      onClose();
    } catch {
      // toast in context
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const canModifyStatus = booking.status === 'Active' || booking.status === 'Confirmed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contract Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 font-mono">
                {booking.id}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusBadge(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Contract created on{' '}
              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }) : 'Recently'}
            </p>
          </div>
        </div>

        {/* Main Details Body */}
        <div className="mt-6 space-y-4 text-xs">
          {/* Vehicle Information */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-red-600" />
              <span>Reserved Vehicle</span>
            </h4>
            <div className="flex items-center gap-3">
              {car?.image && (
                <img
                  src={car.image}
                  alt={booking.carName}
                  className="w-16 h-12 object-cover rounded-xl shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {booking.carName}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Vehicle ID: <span className="font-mono text-slate-700">{booking.carId}</span>
                  {car && ` • ${car.fuelType} • ${car.transmission}`}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-red-600" />
              <span>Renter Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Customer Name
                </span>
                <span className="font-bold text-slate-800 text-xs">
                  {booking.customerName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Driving License
                </span>
                <span className="font-mono font-bold text-slate-800 text-xs flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-red-500" />
                  {booking.drivingLicense || 'DL-VERIFIED'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Contact Number
                </span>
                <span className="text-slate-700 text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {booking.customerPhone || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Email Address
                </span>
                <span className="text-slate-700 text-xs flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {booking.customerEmail || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Rental Duration & Financials */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  <span>Rental Schedule</span>
                </h4>
                <div className="space-y-1">
                  <div>
                    <span className="text-slate-400 text-[10px]">Pickup:</span>{' '}
                    <span className="font-semibold text-slate-800">{booking.startDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Return:</span>{' '}
                    <span className="font-semibold text-slate-800">{booking.endDate}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] pt-1">
                    Duration:{' '}
                    <span className="font-bold text-slate-900">
                      {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:border-l sm:border-slate-200/80 sm:pl-4">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-red-600" />
                  <span>Payment Summary</span>
                </h4>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500">
                    Grand Total Amount:
                  </div>
                  <div className="text-2xl font-black text-red-600">
                    ₹{Number(booking.totalAmount).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    {booking.status === 'Cancelled' ? '• Reservation Voided' : '• Payment Verified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {canModifyStatus
              ? 'Vehicle is locked while booking is Active/Confirmed.'
              : 'Contract is finalized. Vehicle is available in fleet.'}
          </div>

          <div className="flex items-center gap-2">
            {canModifyStatus && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Cancelled')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition-colors"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Cancel Booking</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('Completed')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete Booking</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
