import { useState, useMemo } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Eye, 
  CheckCircle2, 
  Ban, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Plus, 
  Car,
  RotateCcw
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { BookingModal } from '../../components/bookings/BookingModal';
import { BookingDetailModal } from '../../components/bookings/BookingDetailModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const BookingHistory = () => {
  const { bookings, loading, updateBookingStatus } = useCars();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [bookingToComplete, setBookingToComplete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Status Filter Options
  const statusTabs = ['All', 'Active', 'Confirmed', 'Completed', 'Cancelled'];

  // Filtered bookings calculation
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Status Filter
      if (statusFilter !== 'All' && b.status !== statusFilter) {
        return false;
      }

      // 2. Date Filter (matches start date, end date, or created date)
      if (dateFilter) {
        const matchesDate =
          b.startDate === dateFilter ||
          b.endDate === dateFilter ||
          (b.createdAt && b.createdAt.startsWith(dateFilter));
        if (!matchesDate) return false;
      }

      // 3. Search Query
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const matchesId = b.id?.toLowerCase().includes(q);
        const matchesCust = b.customerName?.toLowerCase().includes(q);
        const matchesEmail = b.customerEmail?.toLowerCase().includes(q);
        const matchesPhone = b.customerPhone?.toLowerCase().includes(q);
        const matchesCar = b.carName?.toLowerCase().includes(q);
        if (!matchesId && !matchesCust && !matchesEmail && !matchesPhone && !matchesCar) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, statusFilter, dateFilter, searchTerm]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedBookings = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, activePage, itemsPerPage]);

  // Metric summaries
  const totalCount = bookings.length;
  const activeCount = bookings.filter((b) => b.status === 'Active' || b.status === 'Confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;
  const totalRevenueBooked = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  // Confirm Complete Action
  const handleConfirmComplete = async () => {
    if (!bookingToComplete) return;
    setIsProcessing(true);
    try {
      await updateBookingStatus(bookingToComplete.id, 'Completed');
      setBookingToComplete(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm Cancel Action
  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsProcessing(true);
    try {
      await updateBookingStatus(bookingToCancel.id, 'Cancelled');
      setBookingToCancel(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Confirmed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading && bookings.length === 0) {
    return <LoadingSpinner text="Loading booking history..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Rental Contracts & Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Booking History & Contracts
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track customer reservations, verify rental statuses, and complete or cancel active bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Rental Booking</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Bookings
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">All-time reservations</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Active / Confirmed
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{activeCount}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Vehicles currently reserved</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Completed Trips
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{completedCount}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Vehicles returned safely</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
            Gross Booked Value
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            ₹{totalRevenueBooked.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{cancelledCount} bookings cancelled</p>
        </div>
      </div>

      {/* Filters & Ledger Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Status Filter Tabs */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setStatusFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Date Filter Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search contract ID, customer, vehicle..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="p-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  title="Clear date filter"
                >
                  Clear Date
                </button>
              )}
            </div>
          </div>

          {/* Page size & results count */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
              >
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredBookings.length > 0 ? (activePage - 1) * itemsPerPage + 1 : 0} -{' '}
              {Math.min(activePage * itemsPerPage, filteredBookings.length)} of{' '}
              {filteredBookings.length}
            </span>
          </div>
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CalendarCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm || statusFilter !== 'All' || dateFilter
                ? 'No rental booking matches your current filter criteria. Try resetting your search or filters.'
                : 'No customer reservations have been created yet.'}
            </p>
            {(searchTerm || statusFilter !== 'All' || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setDateFilter('');
                  setCurrentPage(1);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Contract ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Reserved Vehicle</th>
                  <th className="py-3.5 px-4">Rental Duration</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 pr-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedBookings.map((b) => {
                  const canModify = b.status === 'Active' || b.status === 'Confirmed';

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Contract ID */}
                      <td className="py-4 pl-6">
                        <span className="font-mono font-bold text-red-600">
                          {b.id}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400">{b.customerEmail}</div>
                        {b.drivingLicense && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            DL: {b.drivingLicense}
                          </div>
                        )}
                      </td>

                      {/* Reserved Vehicle */}
                      <td className="py-4 px-4 font-medium text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold">{b.carName}</span>
                        </div>
                      </td>

                      {/* Rental Window */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="text-slate-700 font-medium">
                          {b.startDate} ➜ {b.endDate}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {b.totalDays} {b.totalDays === 1 ? 'day' : 'days'}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 text-right font-black text-slate-900 text-sm">
                        ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 pr-6 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setSelectedBookingForDetails(b)}
                            title="View contract details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Complete Booking Status */}
                          {canModify && (
                            <button
                              type="button"
                              onClick={() => setBookingToComplete(b)}
                              title="Mark booking as Completed (Frees vehicle)"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Cancel Booking */}
                          {canModify && (
                            <button
                              type="button"
                              onClick={() => setBookingToCancel(b)}
                              title="Cancel booking (Frees vehicle)"
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredBookings.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Page <span className="font-bold text-slate-900">{activePage}</span> of{' '}
              <span className="font-bold text-slate-900">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={activePage <= 1}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
                    activePage === num
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={activePage >= totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      <BookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* View Booking Details Modal */}
      <BookingDetailModal
        isOpen={Boolean(selectedBookingForDetails)}
        onClose={() => setSelectedBookingForDetails(null)}
        booking={selectedBookingForDetails}
      />

      {/* Complete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(bookingToComplete)}
        onClose={() => setBookingToComplete(null)}
        onConfirm={handleConfirmComplete}
        title="Complete Rental Contract"
        message={`Confirm vehicle return for booking "${bookingToComplete?.id}" (${bookingToComplete?.customerName})? The vehicle "${bookingToComplete?.carName}" will be unlocked and restored to Available in your fleet.`}
        confirmText="Yes, Mark Completed"
        isDanger={false}
        loading={isProcessing}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(bookingToCancel)}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking Contract"
        message={`Are you sure you want to cancel booking "${bookingToCancel?.id}" (${bookingToCancel?.customerName})? The reserved vehicle "${bookingToCancel?.carName}" will be unlocked and returned to Available status.`}
        confirmText="Yes, Cancel Booking"
        isDanger={true}
        loading={isProcessing}
      />
    </div>
  );
};
