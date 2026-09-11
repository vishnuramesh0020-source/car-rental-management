import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  CheckCircle2, 
  Clock, 
  Users, 
  KeyRound, 
  IndianRupee, 
  ArrowUpRight, 
  PlusCircle, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCars } from '../../context/CarContext';
import { StatCard } from '../../components/common/StatCard';
import { CarFormModal } from '../../components/cars/CarFormModal';
import { RentModal } from '../../components/cars/RentModal';

export const Dashboard = () => {
  const { user } = useAuth();
  const { 
    cars, 
    bookings, 
    stats, 
    addCar, 
    resetFleetToDefault
  } = useCars();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [selectedCarForRent, setSelectedCarForRent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pick first available car for quick rent modal if requested
  const handleQuickRent = () => {
    const availableCar = cars.find((c) => c.availability === 'Available') || cars[0];
    if (availableCar) {
      setSelectedCarForRent(availableCar);
      setRentModalOpen(true);
    }
  };

  const handleCreateCar = async (carData) => {
    setIsSubmitting(true);
    try {
      await addCar(carData);
      setAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-red-950/60 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-red-900/30 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fleet Operations Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Fleet Manager'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Here is what's happening with your rental inventory and customer reservations today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/10 transition-colors"
            >
              <span>View Fleet</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Ambient decorative circle */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Module 2: Key Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Fleet Overview & Metrics</h2>
          <span className="text-xs text-slate-500 font-medium">Real-time status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Cars"
            value={stats.totalCars}
            icon={Car}
            colorScheme="crimson"
            subtitle="In system fleet"
          />
          <StatCard
            title="Available Cars"
            value={stats.availableCars}
            icon={CheckCircle2}
            colorScheme="emerald"
            subtitle="Ready for rental"
          />
          <StatCard
            title="Booked Cars"
            value={stats.bookedCars}
            icon={Clock}
            colorScheme="amber"
            subtitle="Currently reserved"
          />
          <StatCard
            title="Active Rentals"
            value={stats.activeRentals}
            icon={KeyRound}
            colorScheme="rose"
            subtitle="On the road"
          />
          <StatCard
            title="Customers"
            value={stats.totalCustomers}
            icon={Users}
            colorScheme="amber"
            subtitle="Registered renters"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={IndianRupee}
            colorScheme="crimson"
            trend={stats.revenueData.growthPercent}
            trendLabel="MoM growth"
            subtitle="Year to date"
          />
        </div>
      </div>

      {/* Revenue & Weekly Performance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Card with dummy trend breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Revenue Performance</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{stats.revenueData.growthPercent}%</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly income distribution and average booking volume
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-2xl font-black text-slate-900 block">
                ₹{stats.revenueData.monthly.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                This Month's Earnings
              </span>
            </div>
          </div>

          {/* Simple Visual Bar Chart using Tailwind */}
          <div className="mt-6 space-y-4">
            <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2">
              {stats.revenueData.weeklyTrend.map((item) => {
                const maxAmount = 4000;
                const heightPercent = Math.round((item.amount / maxAmount) * 100);
                return (
                  <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-full max-w-[44px] bg-slate-100 rounded-xl h-36 flex items-end p-1 overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-red-600 to-amber-500 rounded-lg group-hover:from-red-500 group-hover:to-amber-400 transition-all duration-300 shadow-xs"
                      />
                      {/* Floating tooltip */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        ₹{item.amount}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-red-600 transition-colors">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Avg Daily Revenue: <strong>₹2,642</strong></span>
              <span>Avg Booking Value: <strong>₹{stats.revenueData.averageRentalValue}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rapid operational shortcuts
            </p>

            <div className="mt-5 space-y-3">
              {/* Action 1: Add Car */}
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="w-full p-3.5 rounded-2xl bg-red-50/70 hover:bg-red-100/80 border border-red-100 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-600/30">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      Add New Car
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Register a vehicle into fleet
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-red-600" />
              </button>

              {/* Action 2: View Fleet */}
              <Link
                to="/cars"
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      Manage Fleet
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Filter, edit, or remove vehicles
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600" />
              </Link>

              {/* Action 3: Book Rental */}
              <button
                type="button"
                onClick={handleQuickRent}
                className="w-full p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-100 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Book Rental
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Create customer reservation
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Reset Fleet Demo Button */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={resetFleetToDefault}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Restores standard car fleet demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Fleet to Sample Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module 2: Recent Bookings Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Bookings & Contracts</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Active customer reservations and payment status
            </p>
          </div>

          <Link
            to="/cars"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>View all inventory</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Contract ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Rental Window</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-center pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 pl-2 font-mono font-semibold text-red-600">
                    {b.id}
                  </td>
                  <td className="py-3.5 font-medium text-slate-900">
                    <div>{b.customerName}</div>
                    <span className="text-[11px] text-slate-400">{b.customerEmail}</span>
                  </td>
                  <td className="py-3.5 font-semibold text-slate-800">
                    {b.carName}
                  </td>
                  <td className="py-3.5 text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>
                        {b.startDate} to {b.endDate} ({b.totalDays}d)
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-right font-black text-slate-900">
                    ₹{b.totalAmount}
                  </td>
                  <td className="py-3.5 text-center pr-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        b.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : b.status === 'Confirmed'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Car Modal */}
      <CarFormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreateCar}
        isSubmitting={isSubmitting}
      />

      {/* Rent Modal */}
      <RentModal
        isOpen={rentModalOpen}
        onClose={() => {
          setRentModalOpen(false);
          setSelectedCarForRent(null);
        }}
        car={selectedCarForRent}
      />
    </div>
  );
};
