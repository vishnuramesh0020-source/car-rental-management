import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Fuel, 
  Gauge, 
  Users, 
  Calendar, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Star,
  KeyRound
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { Badge } from '../../components/common/Badge';
import { CarFormModal } from '../../components/cars/CarFormModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { RentModal } from '../../components/cars/RentModal';
import { LoadingSpinner, ErrorState } from '../../components/common/LoadingSpinner';

export const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCarById, updateCar, deleteCar, loading: fleetLoading } = useCars();

  const car = getCarById(id);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      const updated = await updateCar(car.id, formData);
      setCar(updated);
      setEditModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteCar(car.id);
      setDeleteModalOpen(false);
      navigate('/cars');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fleetLoading) {
    return <LoadingSpinner label="Loading vehicle details..." fullScreen />;
  }

  if (!car) {
    return (
      <div className="py-12">
        <ErrorState
          message={`The car with ID "${id}" could not be located in our inventory.`}
          onRetry={() => navigate('/cars')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back link & Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fleet Catalogue</span>
        </Link>

        <div className="flex items-center gap-2">
          {car.availability === 'Available' && (
            <button
              type="button"
              onClick={() => setRentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Rent This Vehicle</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
            title="Edit Specifications"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
            title="Delete Vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Vehicle Showcase, Right Pricing & Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Hero & Technical Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image Showcase */}
          <div className="relative aspect-16/10 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute top-4 left-4">
              <Badge status={car.availability} />
            </div>
            <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{car.rating || 4.9} rating</span>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                {car.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {car.model}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Model Year {car.year} • Recorded Mileage: {car.mileage || '10,000 mi'}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {car.description ||
                'This vehicle offers unmatched performance, advanced technological amenities, and comprehensive safety features to guarantee peace of mind.'}
            </p>

            {/* Specifications Matrix */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Key Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Fuel className="w-4 h-4 text-red-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Fuel Type
                  </span>
                  <span className="text-sm font-bold text-slate-900">{car.fuelType}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Gauge className="w-4 h-4 text-red-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Transmission
                  </span>
                  <span className="text-sm font-bold text-slate-900">{car.transmission}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Users className="w-4 h-4 text-red-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Capacity
                  </span>
                  <span className="text-sm font-bold text-slate-900">{car.seatingCapacity} Passengers</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Calendar className="w-4 h-4 text-red-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Year
                  </span>
                  <span className="text-sm font-bold text-slate-900">{car.year}</span>
                </div>
              </div>
            </div>

            {/* Features list */}
            {car.features && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Vehicle Highlights & Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(car.features)
                    ? car.features
                    : car.features.split(',')
                  ).map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                      <span>{typeof f === 'string' ? f.trim() : f}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Rental Action Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Standard Rental Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  ₹{car.pricePerDay}
                </span>
                <span className="text-sm font-semibold text-slate-500">/ day</span>
              </div>
            </div>

            {/* Status Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Availability</span>
                <Badge status={car.availability} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Insurance Coverage</span>
                <span className="font-semibold text-slate-800">Comprehensive</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Mileage Policy</span>
                <span className="font-semibold text-slate-800">Unlimited km</span>
              </div>
            </div>

            {/* Rent Button */}
            {car.availability === 'Available' ? (
              <button
                type="button"
                onClick={() => setRentModalOpen(true)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <KeyRound className="w-4 h-4" />
                <span>Reserve Vehicle Now</span>
              </button>
            ) : (
              <div className="text-center p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs font-semibold text-amber-800">
                This vehicle is currently {car.availability.toLowerCase()}.
              </div>
            )}

            {/* Guarantee note */}
            <div className="flex items-start gap-2.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Includes 24/7 roadside assistance, clean interior sanitization, and flexible cancellation.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <CarFormModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdate}
        initialData={car}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete ${car.brand} ${car.model}?`}
        message="This vehicle will be permanently removed from your system catalog and won't be available for future reservations."
        confirmText="Confirm Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isSubmitting}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />

      {/* Rent Modal */}
      <RentModal
        isOpen={rentModalOpen}
        onClose={() => setRentModalOpen(false)}
        car={car}
      />
    </div>
  );
};
