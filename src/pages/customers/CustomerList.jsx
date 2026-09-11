import { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  FileCheck, 
  MapPin, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  X
} from 'lucide-react';
import { useCars } from '../../context/CarContext';
import { CustomerFormModal } from '../../components/customers/CustomerFormModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CustomerList = () => {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCars();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Filtered customers based on search query
  const filteredCustomers = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter((c) => {
      const name = c.name?.toLowerCase() || '';
      const email = c.email?.toLowerCase() || '';
      const phone = c.phone?.toLowerCase() || '';
      const license = c.drivingLicense?.toLowerCase() || '';
      const address = c.address?.toLowerCase() || '';
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        license.includes(q) ||
        address.includes(q)
      );
    });
  }, [customers, searchTerm]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, activePage, itemsPerPage]);

  const handleOpenAdd = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setSelectedCustomer(cust);
    setIsFormOpen(true);
  };

  const handleSaveCustomer = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, data);
      } else {
        await addCustomer(data);
      }
      setIsFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // High-level customer stats
  const totalRentalsSum = useMemo(
    () => customers.reduce((sum, c) => sum + (Number(c.totalRentals) || 0), 0),
    [customers]
  );
  const totalSpentSum = useMemo(
    () => customers.reduce((sum, c) => sum + (Number(c.spent) || 0), 0),
    [customers]
  );

  if (loading && customers.length === 0) {
    return <LoadingSpinner text="Loading customer profiles..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Customer Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Customer Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Register, update, and manage customer records, driving licenses, and rental histories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Customer</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Customers
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{customers.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Verified profiles on record</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Rentals Booked
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalRentalsSum}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Completed & active bookings</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Customer Lifetime Spend
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹{totalSpentSum.toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Total customer billing to date</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search Bar & Page Size Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, mobile, license..."
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

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
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
              <span>per page</span>
            </div>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Showing {filteredCustomers.length > 0 ? (activePage - 1) * itemsPerPage + 1 : 0} -{' '}
              {Math.min(activePage * itemsPerPage, filteredCustomers.length)} of{' '}
              {filteredCustomers.length}
            </span>
          </div>
        </div>

        {/* Customer Table */}
        {filteredCustomers.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Customers Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm
                ? `No customer profile matches "${searchTerm}". Try resetting your search term.`
                : 'No customers have been registered yet. Add your first customer to begin.'}
            </p>
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
              >
                Clear search query
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-xl shadow-sm hover:bg-red-500 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Customer</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6">Customer Profile</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Driving License</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4 text-right">Rentals & Spend</th>
                  <th className="py-3.5 pr-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedCustomers.map((cust) => {
                  const initials = cust.name
                    ? cust.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'CU';

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Customer Profile */}
                      <td className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-red-500/20">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                              {cust.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {cust.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{cust.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{cust.email}</span>
                        </div>
                      </td>

                      {/* Driving License */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[11px] font-semibold">
                          <FileCheck className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{cust.drivingLicense}</span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-start gap-1.5 text-slate-600 text-[11px] leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2" title={cust.address}>
                            {cust.address}
                          </span>
                        </div>
                      </td>

                      {/* Rentals & Spend */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-bold text-slate-900">
                          ₹{(cust.spent || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {cust.totalRentals || 0} {(cust.totalRentals === 1) ? 'trip' : 'trips'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cust)}
                            title="Edit customer details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomerToDelete(cust)}
                            title="Delete customer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
        {filteredCustomers.length > 0 && (
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

              {/* Numbered Page Buttons */}
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

      {/* Customer Add/Edit Modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveCustomer}
        customer={selectedCustomer}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Customer Record"
        message={`Are you sure you want to delete customer "${customerToDelete?.name}" (${customerToDelete?.email})? This action cannot be undone.`}
        confirmText="Yes, Delete Customer"
        isDanger={true}
        loading={isSubmitting}
      />
    </div>
  );
};
