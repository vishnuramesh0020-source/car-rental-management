import { useState } from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';

const POPULAR_BRANDS = [
  'Tesla',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Ford',
  'Toyota',
  'Hyundai',
  'Honda',
  'Nissan',
  'Chevrolet',
  'Lexus',
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80',
];

const CarFormModalDialog = ({
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        brand: initialData.brand || '',
        model: initialData.model || '',
        year: initialData.year || new Date().getFullYear(),
        pricePerDay: initialData.pricePerDay || '',
        fuelType: initialData.fuelType || 'Petrol',
        transmission: initialData.transmission || 'Automatic',
        seatingCapacity: initialData.seatingCapacity || 5,
        availability: initialData.availability || 'Available',
        image: initialData.image || '',
        description: initialData.description || '',
        features: Array.isArray(initialData.features)
          ? initialData.features.join(', ')
          : initialData.features || '',
        mileage: initialData.mileage || '12,000 mi',
      };
    }
    return {
      brand: 'Tesla',
      model: '',
      year: new Date().getFullYear(),
      pricePerDay: '',
      fuelType: 'Electric',
      transmission: 'Automatic',
      seatingCapacity: 5,
      availability: 'Available',
      image: DEFAULT_IMAGES[0],
      description: '',
      features: 'Apple CarPlay, Heated Seats, Bluetooth, Cruise Control',
      mileage: '5,000 mi',
    };
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.brand.trim()) errs.brand = 'Brand is required';
    if (!formData.model.trim()) errs.model = 'Model is required';
    
    const yr = Number(formData.year);
    if (!formData.year || isNaN(yr) || yr < 1990 || yr > new Date().getFullYear() + 2) {
      errs.year = `Valid year between 1990 and ${new Date().getFullYear() + 1} required`;
    }

    const price = Number(formData.pricePerDay);
    if (!formData.pricePerDay || isNaN(price) || price <= 0) {
      errs.pricePerDay = 'Valid positive daily price is required';
    }

    const seats = Number(formData.seatingCapacity);
    if (!formData.seatingCapacity || isNaN(seats) || seats < 1 || seats > 12) {
      errs.seatingCapacity = 'Seats must be between 1 and 12';
    }

    if (!formData.image.trim()) {
      errs.image = 'Image URL is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal dialog */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit Vehicle Details' : 'Add New Car to Fleet'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit
                ? `Update specifications for ${initialData?.brand} ${initialData?.model}`
                : 'Fill in vehicle information, technical specs, and rental rates.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Row 1: Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  list="brand-suggestions"
                  placeholder="e.g. BMW, Tesla"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition-all ${
                    errors.brand
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                  }`}
                />
                <datalist id="brand-suggestions">
                  {POPULAR_BRANDS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>
              {errors.brand && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.brand}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Model Name *
              </label>
              <input
                type="text"
                placeholder="e.g. M4 Competition"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.model
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                }`}
              />
              {errors.model && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.model}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Year, Daily Price, Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Manufacturing Year *
              </label>
              <input
                type="number"
                min="1990"
                max={new Date().getFullYear() + 2}
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.year
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                }`}
              />
              {errors.year && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.year}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price Per Day (₹) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 120"
                value={formData.pricePerDay}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerDay: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.pricePerDay
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                }`}
              />
              {errors.pricePerDay && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.pricePerDay}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Seating Capacity *
              </label>
              <select
                value={formData.seatingCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, seatingCapacity: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value={2}>2 Seats (Coupe/Roadster)</option>
                <option value={4}>4 Seats (Sport/Sedan)</option>
                <option value={5}>5 Seats (Full Sedan/SUV)</option>
                <option value={7}>7 Seats (Large SUV)</option>
                <option value={8}>8 Seats (Van)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Fuel Type, Transmission, Availability Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fuel Type *
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) =>
                  setFormData({ ...formData, fuelType: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Transmission *
              </label>
              <select
                value={formData.transmission}
                onChange={(e) =>
                  setFormData({ ...formData, transmission: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Availability Status *
              </label>
              <select
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Row 4: Image URL with Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Car Image URL *
              </label>
              <div className="flex items-center gap-1 text-[11px] text-red-600 font-semibold cursor-pointer">
                <Sparkles className="w-3 h-3" />
                <span
                  onClick={() => {
                    const randomImg =
                      DEFAULT_IMAGES[
                        Math.floor(Math.random() * DEFAULT_IMAGES.length)
                      ];
                    setFormData({ ...formData, image: randomImg });
                  }}
                >
                  Pick sample image
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-hidden focus:ring-2 transition-all ${
                    errors.image
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-red-500/20 focus:border-red-500'
                  }`}
                />
                {errors.image && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Live Image Preview */}
              <div className="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-300" />
                )}
              </div>
            </div>
          </div>

          {/* Row 5: Description & Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description / Highlights
              </label>
              <textarea
                rows={2}
                placeholder="Key highlights, driving feel, exterior condition..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Key Features (comma separated)
              </label>
              <textarea
                rows={2}
                placeholder="Autopilot, Heated Seats, Panoramic Roof"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isEdit ? 'Save Changes' : 'Add to Fleet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const CarFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <CarFormModalDialog
      key={initialData ? initialData.id : 'new'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      isSubmitting={isSubmitting}
    />
  );
};
