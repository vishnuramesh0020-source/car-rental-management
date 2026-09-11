import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  SearchX, 
  RotateCcw, 
  KeyRound 
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { CarCard } from '../../components/cars/CarCard';
import { CarFilterBar } from '../../components/cars/CarFilterBar';
import { CarFormModal } from '../../components/cars/CarFormModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { RentModal } from '../../components/cars/RentModal';
import { Badge } from '../../components/common/Badge';
import { CarCardSkeleton, ErrorState } from '../../components/common/LoadingSpinner';

export const CarList = () => {
  const { 
    filteredCars, 
    loading, 
    error, 
    addCar, 
    updateCar, 
    deleteCar, 
    resetFilters,
    refreshCars 
  } = useCars();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [carToRent, setCarToRent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open Add Car modal
  const handleOpenAdd = () => {
    setEditingCar(null);
    setFormModalOpen(true);
  };

  // Open Edit Car modal
  const handleOpenEdit = (car) => {
    setEditingCar(car);
    setFormModalOpen(true);
  };

  // Open Delete confirmation dialog
  const handleOpenDelete = (car) => {
    setCarToDelete(car);
    setDeleteModalOpen(true);
  };

  // Open Rent modal
  const handleOpenRent = (car) => {
    setCarToRent(car);
    setRentModalOpen(true);
  };

  // Handle Form submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCar) {
        await updateCar(editingCar.id, formData);
      } else {
        await addCar(formData);
      }
      setFormModalOpen(false);
      setEditingCar(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete confirmation
  const handleConfirmDelete = async () => {
    if (!carToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteCar(carToDelete.id);
      setDeleteModalOpen(false);
      setCarToDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fleet Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, monitor, filter, and manage rental vehicle inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <CarFilterBar viewMode={viewMode} setViewMode={setViewMode} />

      {/* Error state */}
      {error && (
        <ErrorState message={error} onRetry={refreshCars} />
      )}

      {/* Loading Skeletons */}
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CarCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCars.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No vehicles match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Try adjusting your search keywords, fuel, transmission, or price filter.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Grid View */}
      {!loading && !error && filteredCars.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onRent={handleOpenRent}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {!loading && !error && filteredCars.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Specs</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Daily Rate</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.image}
                          alt={car.model}
                          className="w-12 h-9 object-cover rounded-lg shrink-0"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80';
                          }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {car.brand} {car.model}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {car.mileage || 'Low mileage'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {car.year}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="space-y-0.5">
                        <span className="block font-medium">
                          {car.fuelType} • {car.transmission}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {car.seatingCapacity} Passengers
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={car.availability} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-black text-slate-900">
                        ₹{car.pricePerDay}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/day</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {car.availability === 'Available' && (
                          <button
                            type="button"
                            onClick={() => handleOpenRent(car)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Rent Car"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(car)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Edit Car"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(car)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Car"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/cars/${car.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <CarFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingCar(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCar}
        isSubmitting={isSubmitting}
      />

      {/* Confirmation Dialog before Delete */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete ${carToDelete?.brand} ${carToDelete?.model}?`}
        message="Are you sure you want to delete this vehicle from your active fleet? This action is permanent and will remove all pricing and specs records."
        confirmText="Delete Vehicle"
        cancelText="Keep Vehicle"
        isDestructive={true}
        isLoading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setCarToDelete(null);
        }}
      />

      {/* Rent / Book Modal */}
      <RentModal
        isOpen={rentModalOpen}
        onClose={() => {
          setRentModalOpen(false);
          setCarToRent(null);
        }}
        car={carToRent}
      />
    </div>
  );
};
