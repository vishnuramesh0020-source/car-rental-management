import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, FileCheck, Loader2 } from 'lucide-react';

export const CustomerFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  customer = null,
  isSubmitting = false,
}) => {
  const isEdit = Boolean(customer);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    drivingLicense: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        drivingLicense: customer.drivingLicense || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        drivingLicense: '',
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    // Name validation
    if (!formData.name.trim()) {
      errs.name = 'Full Name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Mobile Number validation
    const phoneClean = formData.phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile Number is required.';
    } else if (!phoneRegex.test(phoneClean)) {
      errs.phone = 'Enter a valid 10-digit mobile number (e.g. +91 98765 43210 or 9876543210).';
    }

    // Address validation
    if (!formData.address.trim()) {
      errs.address = 'Residential / Business Address is required.';
    } else if (formData.address.trim().length < 5) {
      errs.address = 'Please provide a complete address.';
    }

    // Driving License Number validation
    const dlRegex = /^[A-Z0-9\s-]{6,20}$/i;
    if (!formData.drivingLicense.trim()) {
      errs.drivingLicense = 'Driving License Number is required.';
    } else if (!dlRegex.test(formData.drivingLicense.trim())) {
      errs.drivingLicense = 'Enter a valid driving license number (e.g., KA-012022004521).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        drivingLicense: formData.drivingLicense.trim().toUpperCase(),
      });
    } catch {
      // Error handled by parent or context
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            {isEdit ? 'Update Customer' : 'Customer Registration'}
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            {isEdit ? `Edit ${customer.name}` : 'Register New Customer'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isEdit
              ? 'Modify customer profile and rental eligibility details.'
              : 'Add verified customer records for rental contracts and billing.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
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

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. rahul.sharma@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
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

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.phone
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Driving License Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Driving License Number *
            </label>
            <div className="relative">
              <FileCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. KA-012022004521"
                value={formData.drivingLicense}
                onChange={(e) => handleChange('drivingLicense', e.target.value.toUpperCase())}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 ${
                  errors.drivingLicense
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                }`}
              />
            </div>
            {errors.drivingLicense && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.drivingLicense}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Complete Residential / Office Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={3}
                placeholder="e.g. Flat 302, Green Valley Apartments, MG Road, Bangalore, KA 560001"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 resize-none ${
                  errors.address
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                }`}
              />
            </div>
            {errors.address && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.address}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-sm font-semibold shadow-md shadow-red-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEdit ? 'Save Changes' : 'Register Customer'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
