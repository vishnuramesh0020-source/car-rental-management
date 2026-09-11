import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CarFormModal } from '../cars/CarFormModal';
import { BookingModal } from '../bookings/BookingModal';
import { useCars } from '../../context/CarContext';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCar } = useCars();

  const handleCreateCar = async (carData) => {
    setIsSubmitting(true);
    try {
      await addCar(carData);
      setAddModalOpen(false);
    } catch {
      // toast shown in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenAddCar={() => setAddModalOpen(true)}
        onOpenBookRental={() => setBookingModalOpen(true)}
      />

      {/* Main Content Area with Desktop Sidebar Offset */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Navbar */}
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddCar={() => setAddModalOpen(true)}
          onOpenBookRental={() => setBookingModalOpen(true)}
        />

        {/* Page View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Add Car Modal */}
      <CarFormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreateCar}
        isSubmitting={isSubmitting}
      />

      {/* Global Rental Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
};
