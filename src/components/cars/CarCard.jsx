import { Link } from 'react-router-dom';
import { 
  Fuel, 
  Gauge, 
  Users, 
  Calendar, 
  Edit3, 
  Trash2, 
  ArrowUpRight,
  KeyRound
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const CarCard = ({ car, onEdit, onDelete, onRent }) => {
  return (
    <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Floating Status */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        
        {/* Floating Availability Badge */}
        <div className="absolute top-3 left-3">
          <Badge status={car.availability} />
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Calendar className="w-3 h-3 text-red-400" />
          <span>{car.year}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model Header */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              {car.brand}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {car.mileage || 'Low mileage'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">
            {car.model}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {car.description || 'Premium rental vehicle with modern safety systems and comfort.'}
          </p>

          {/* Specifications Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 py-3 px-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600">
            <div className="flex items-center gap-1.5 text-xs">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{car.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{car.seatingCapacity} Seats</span>
            </div>
          </div>
        </div>

        {/* Footer: Pricing & Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block -mb-0.5">
              Daily Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{car.pricePerDay}
              </span>
              <span className="text-xs font-medium text-slate-500">/day</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {onRent && car.availability === 'Available' && (
              <button
                type="button"
                onClick={() => onRent(car)}
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all font-semibold text-xs flex items-center gap-1"
                title="Book / Rent Car"
              >
                <KeyRound className="w-4 h-4" />
                <span className="hidden sm:inline">Rent</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(car)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Edit Car Details"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(car)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Car"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <Link
              to={`/cars/${car.id}`}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-red-600 text-white transition-all shadow-xs"
              title="View Car Details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
