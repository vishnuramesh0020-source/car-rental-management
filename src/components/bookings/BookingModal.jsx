import { useState, useEffect } from 'react';
import { 
  X, 
  Car as CarIcon, 
  User, 
  Calendar, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Plus,
  Loader2,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { useCars } from '../../context/CarContext';

export const BookingModal = ({
  isOpen,
  onClose,
  preselectedCarId = null,
  preselectedCustomerId = null,
}) => {
  const { cars, customers, addBooking, addCustomer } = useCars();

  const [selectedCarId, setSelectedCarId] = useState(preselectedCarId || '');
  const [selectedCustomerId, setSelectedCustomerId] = useState(preselectedCustomerId || '');
  
  // Date setup: today to +3 days
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultReturn = new Date();
  defaultReturn.setDate(defaultReturn.getDate() + 3);
  const defaultReturnStr = defaultReturn.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(defaultReturnStr);

  // Quick Inline New Customer Form Toggle
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustData, setNewCustData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    drivingLicense: '',
  });
  const [custErrors, setCustErrors] = useState({});

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      if (preselectedCarId) {
        setSelectedCarId(preselectedCarId);
      } else {
        // Pick first available car if none preselected
        const firstAvailable = cars.find((c) => c.availability === 'Available');
        if (firstAvailable) setSelectedCarId(firstAvailable.id);
      }

      if (preselectedCustomerId) {
        setSelectedCustomerId(preselectedCustomerId);
      } else if (customers.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(customers[0].id);
      }

      setPickupDate(todayStr);
      setReturnDate(defaultReturnStr);
      setErrors({});
      setShowNewCustomerForm(false);
    }
  }, [isOpen, preselectedCarId, preselectedCustomerId, cars, customers]);

  if (!isOpen) return null;

  // Selected entities
  const selectedCar = cars.find((c) => String(c.id) === String(selectedCarId));
  const selectedCustomer = customers.find((c) => String(c.id) === String(selectedCustomerId));

  // Check if selected car is already reserved/unavailable
  const isCarReserved = selectedCar && selectedCar.availability !== 'Available';

  // Auto Calculate Rental Days
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Total Cost Calculation
  const dailyRate = selectedCar ? Number(selectedCar.pricePerDay) || 0 : 0;
  const totalCost = diffDays * dailyRate;

  // Handle Quick Customer Registration
  const handleCreateQuickCustomer = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newCustData.name.trim()) errs.name = 'Full name is required';
    if (!newCustData.email.trim() || !newCustData.email.includes('@')) errs.email = 'Valid email is required';
    if (!newCustData.phone.trim()) errs.phone = 'Mobile number is required';
    if (!newCustData.drivingLicense.trim()) errs.drivingLicense = 'Driving license is required';
    if (!newCustData.address.trim()) errs.address = 'Address is required';

    if (Object.keys(errs).length > 0) {
      setCustErrors(errs);
      return;
    }

    try {
      const created = await addCustomer(newCustData);
      setSelectedCustomerId(created.id);
      setShowNewCustomerForm(false);
      setNewCustData({ name: '', email: '', phone: '', address: '', drivingLicense: '' });
      setCustErrors({});
    } catch {
      // toast shown in context
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    const errs = {};

    if (!selectedCustomerId) {
      errs.customer = 'Please select or register a customer.';
    }

    if (!selectedCarId) {
      errs.car = 'Please select a vehicle.';
    } else if (isCarReserved) {
      errs.car = `This vehicle is ${selectedCar.availability} and cannot be reserved.`;
    }

    if (!pickupDate) {
      errs.pickupDate = 'Pickup date is required.';
    }

    if (!returnDate) {
      errs.returnDate = 'Return date is required.';
    } else if (new Date(returnDate) < new Date(pickupDate)) {
      errs.returnDate = 'Return date cannot be earlier than pickup date.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      await addBooking({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerEmail: selectedCustomer.email,
        customerPhone: selectedCustomer.phone,
        drivingLicense: selectedCustomer.drivingLicense,
        carId: selectedCar.id,
        carName: `${selectedCar.brand} ${selectedCar.model}`,
        startDate: pickupDate,
        endDate: returnDate,
        totalDays: diffDays,
        totalAmount: totalCost,
        status: 'Active',
      });
      onClose();
    } catch {
      // toast shown by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 my-8">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Module 5 • Rental Booking
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            Create Rental Reservation
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Generate a verified rental contract, calculate daily rates, and automatically reserve inventory.
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleConfirmBooking} className="mt-6 space-y-5">
          {/* STEP 1: Select Customer */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-600" />
                <span>1. Select Customer *</span>
              </label>

              <button
                type="button"
                onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showNewCustomerForm ? 'Pick Existing' : 'New Customer'}</span>
              </button>
            </div>

            {!showNewCustomerForm ? (
              <div>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    if (errors.customer) setErrors((prev) => ({ ...prev, customer: undefined }));
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} • {c.phone} (DL: {c.drivingLicense})
                    </option>
                  ))}
                </select>

                {selectedCustomer && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {selectedCustomer.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {selectedCustomer.email}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-700 font-semibold">
                      <FileCheck className="w-3 h-3 text-red-500" />
                      {selectedCustomer.drivingLicense}
                    </span>
                  </div>
                )}
                {errors.customer && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.customer}</p>
                )}
              </div>
            ) : (
              /* Inline Quick Customer Creation Form */
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={newCustData.name}
                    onChange={(e) => setNewCustData({ ...newCustData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={newCustData.email}
                    onChange={(e) => setNewCustData({ ...newCustData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number (+91) *"
                    value={newCustData.phone}
                    onChange={(e) => setNewCustData({ ...newCustData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Driving License (DL-XXXX) *"
                    value={newCustData.drivingLicense}
                    onChange={(e) => setNewCustData({ ...newCustData, drivingLicense: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address *"
                  value={newCustData.address}
                  onChange={(e) => setNewCustData({ ...newCustData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                {Object.keys(custErrors).length > 0 && (
                  <p className="text-[11px] text-rose-600 font-medium">
                    Please fill all required customer fields accurately.
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleCreateQuickCustomer}
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Save & Select Customer
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: Select Car (Enforces Reserved Protection) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <CarIcon className="w-3.5 h-3.5 text-red-600" />
              <span>2. Select Vehicle (Fleet Availability) *</span>
            </label>

            <select
              value={selectedCarId}
              onChange={(e) => {
                setSelectedCarId(e.target.value);
                if (errors.car) setErrors((prev) => ({ ...prev, car: undefined }));
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            >
              <option value="">-- Choose Car --</option>
              {cars.map((car) => {
                const isUnavailable = car.availability !== 'Available';
                return (
                  <option
                    key={car.id}
                    value={car.id}
                    disabled={isUnavailable}
                    className={isUnavailable ? 'text-slate-400 bg-slate-100' : 'text-slate-900'}
                  >
                    {car.brand} {car.model} ({car.year}) — ₹{car.pricePerDay}/day {isUnavailable ? `[${car.availability} - Cannot Book]` : '• Available'}
                  </option>
                );
              })}
            </select>

            {/* Warning if vehicle is already reserved */}
            {isCarReserved && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">Vehicle Currently Unavailable:</span>{' '}
                  {selectedCar.brand} {selectedCar.model} is currently marked as{' '}
                  <span className="font-bold underline">{selectedCar.availability}</span>. You cannot book an already reserved car. Please pick an Available car.
                </div>
              </div>
            )}

            {/* Selected Car Preview */}
            {selectedCar && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3.5">
                <img
                  src={selectedCar.image}
                  alt={selectedCar.model}
                  className="w-16 h-12 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedCar.fuelType} • {selectedCar.transmission} • {selectedCar.seatingCapacity} seats
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-slate-900">₹{selectedCar.pricePerDay}</span>
                  <span className="text-[10px] text-slate-400 block -mt-0.5">/day</span>
                </div>
              </div>
            )}
            {errors.car && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.car}</p>
            )}
          </div>

          {/* STEP 3 & 4: Rental Dates, Auto Days & Total Cost */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>3. Rental Schedule & Rate Calculation</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    if (new Date(e.target.value) > new Date(returnDate)) {
                      setReturnDate(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                {errors.pickupDate && (
                  <p className="text-xs text-rose-600 mt-1">{errors.pickupDate}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Return Date *
                </label>
                <input
                  type="date"
                  min={pickupDate || todayStr}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                {errors.returnDate && (
                  <p className="text-xs text-rose-600 mt-1">{errors.returnDate}</p>
                )}
              </div>
            </div>

            {/* Rate & Days Calculation Summary Card */}
            <div className="mt-4 p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Calculated Duration:</span>
                <span className="text-sm font-bold text-slate-900">
                  {diffDays} {diffDays === 1 ? 'Day' : 'Days'}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  (@ ₹{dailyRate}/day)
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Total Rental Cost:</span>
                <span className="text-xl font-black text-red-600">
                  ₹{totalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 5: Booking Summary Pill before Confirming */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-100 flex items-start gap-3 text-xs text-slate-700">
            <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Booking Summary:</span>{' '}
              Reserving {selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : 'Vehicle'} for{' '}
              <span className="font-semibold text-slate-900">{selectedCustomer?.name || 'Customer'}</span>{' '}
              from <span className="font-semibold">{pickupDate}</span> to{' '}
              <span className="font-semibold">{returnDate}</span> ({diffDays} days). Total payable: <span className="font-bold text-red-700">₹{totalCost.toLocaleString('en-IN')}</span>. Vehicle will be locked as Booked upon confirmation.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCarReserved || !selectedCar || !selectedCustomer}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-sm font-semibold shadow-md shadow-red-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming Reservation...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Lock Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
