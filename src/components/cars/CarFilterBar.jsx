import { Search, RotateCcw, LayoutGrid, List } from 'lucide-react';
import { useCars } from '../../context/CarContext';

export const CarFilterBar = ({ viewMode, setViewMode }) => {
  const { filters, setFilter, resetFilters, availableBrands, filteredCars, cars } =
    useCars();

  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['Automatic', 'Manual'];
  const availabilities = ['Available', 'Booked', 'Maintenance'];

  const isFiltered =
    filters.search !== '' ||
    filters.brand !== 'All' ||
    filters.fuelType !== 'All' ||
    filters.transmission !== 'All' ||
    filters.availability !== 'All' ||
    filters.sortBy !== 'featured';

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Top row: Search input + View toggle + Reset */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cars by brand, model, or year..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => setFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right side controls: Result count & View Mode */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <span className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900">{filteredCars.length}</strong> of{' '}
            {cars.length} cars
          </span>

          {/* Grid / List view toggle */}
          {setViewMode && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-red-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-red-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
        {/* Brand filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Brand
          </label>
          <select
            value={filters.brand}
            onChange={(e) => setFilter('brand', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            <option value="All">All Brands</option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Fuel Type
          </label>
          <select
            value={filters.fuelType}
            onChange={(e) => setFilter('fuelType', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            <option value="All">All Fuels</option>
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Transmission
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => setFilter('transmission', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            <option value="All">All Transmissions</option>
            {transmissions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Availability filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filters.availability}
            onChange={(e) => setFilter('availability', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            <option value="All">All Statuses</option>
            {availabilities.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by Price & Year */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className="w-full px-3 py-2 bg-red-50/60 border border-red-200 rounded-xl text-xs font-semibold text-red-950 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            <option value="featured">Featured / Default</option>
            <option value="price-asc">Price: Low to High (₹)</option>
            <option value="price-desc">Price: High to Low (₹)</option>
            <option value="year-desc">Year: Newest First</option>
            <option value="year-asc">Year: Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};
