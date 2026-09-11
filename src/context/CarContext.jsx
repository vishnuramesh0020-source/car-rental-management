import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { carService, customerService, bookingService } from '../services/api';
import { DUMMY_REVENUE } from '../services/seedData';
import { toast } from 'react-toastify';

export const CarContext = createContext(null);

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [filters, setFilters] = useState({
    search: '',
    brand: 'All',
    fuelType: 'All',
    transmission: 'All',
    availability: 'All',
    sortBy: 'featured', // 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc'
  });

  // Fetch cars, bookings, and customers on mount
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedCars, fetchedBookings, fetchedCustomers] = await Promise.all([
        carService.getCars(),
        bookingService.getBookings(),
        customerService.getCustomers(),
      ]);
      setCars(fetchedCars);
      setBookings(fetchedBookings);
      setCustomers(fetchedCustomers);
    } catch (err) {
      console.error('Failed to load fleet data:', err);
      setError(err.message || 'Failed to fetch application data.');
      toast.error('Failed to fetch application data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Update filter criteria
  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      brand: 'All',
      fuelType: 'All',
      transmission: 'All',
      availability: 'All',
      sortBy: 'featured',
    });
  };

  // Add new car
  const addCar = async (carData) => {
    try {
      const created = await carService.createCar(carData);
      setCars((prev) => [created, ...prev]);
      toast.success(`${created.brand} ${created.model} added to fleet!`);
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to add car.');
      throw err;
    }
  };

  // Update car
  const updateCar = async (id, updatedData) => {
    try {
      const updated = await carService.updateCar(id, updatedData);
      setCars((prev) => prev.map((car) => (car.id === id ? updated : car)));
      toast.success(`${updated.brand} ${updated.model} updated successfully!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update car.');
      throw err;
    }
  };

  // Delete car
  const deleteCar = async (id) => {
    try {
      const carToDelete = cars.find((c) => c.id === id);
      await carService.deleteCar(id);
      setCars((prev) => prev.filter((car) => car.id !== id));
      toast.success(
        carToDelete
          ? `${carToDelete.brand} ${carToDelete.model} removed from fleet.`
          : 'Car removed successfully.'
      );
    } catch (err) {
      toast.error(err.message || 'Failed to delete car.');
      throw err;
    }
  };

  // Get car by ID
  const getCarById = useCallback(
    (id) => {
      return cars.find((c) => String(c.id) === String(id));
    },
    [cars]
  );

  // Customer CRUD operations
  const addCustomer = async (customerData) => {
    try {
      const created = await customerService.createCustomer(customerData);
      setCustomers((prev) => [created, ...prev]);
      toast.success(`Customer ${created.name} registered successfully!`);
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to add customer.');
      throw err;
    }
  };

  const updateCustomer = async (id, updatedData) => {
    try {
      const updated = await customerService.updateCustomer(id, updatedData);
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success(`Customer ${updated.name} updated successfully!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update customer.');
      throw err;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const customerToDelete = customers.find((c) => c.id === id);
      await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success(
        customerToDelete
          ? `Customer ${customerToDelete.name} removed.`
          : 'Customer removed.'
      );
    } catch (err) {
      toast.error(err.message || 'Failed to delete customer.');
      throw err;
    }
  };

  const getCustomerById = useCallback(
    (id) => {
      return customers.find((c) => String(c.id) === String(id));
    },
    [customers]
  );

  // Booking operations
  const addBooking = async (bookingData) => {
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      setBookings((prev) => [newBooking, ...prev]);

      // Update car status locally if booked
      if (bookingData.carId) {
        setCars((prev) =>
          prev.map((c) =>
            c.id === bookingData.carId ? { ...c, availability: 'Booked' } : c
          )
        );
      }

      // Update customer stats locally
      if (bookingData.customerId) {
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === bookingData.customerId
              ? {
                  ...c,
                  totalRentals: (Number(c.totalRentals) || 0) + 1,
                  spent: (Number(c.spent) || 0) + (Number(bookingData.totalAmount) || 0),
                }
              : c
          )
        );
      }

      toast.success(`Booking ${newBooking.id} confirmed for ${newBooking.customerName}!`);
      return newBooking;
    } catch (err) {
      toast.error(err.message || 'Booking failed.');
      throw err;
    }
  };

  const updateBookingStatus = async (id, newStatus) => {
    try {
      const updated = await bookingService.updateBookingStatus(id, newStatus);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));

      // If status changed to Completed or Cancelled, free up car in state
      if (newStatus === 'Completed' || newStatus === 'Cancelled') {
        if (updated.carId) {
          setCars((prev) =>
            prev.map((c) =>
              c.id === updated.carId ? { ...c, availability: 'Available' } : c
            )
          );
        }
      } else if (newStatus === 'Active' || newStatus === 'Confirmed') {
        if (updated.carId) {
          setCars((prev) =>
            prev.map((c) =>
              c.id === updated.carId ? { ...c, availability: 'Booked' } : c
            )
          );
        }
      }

      toast.success(`Booking ${id} marked as ${newStatus}!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update booking status.');
      throw err;
    }
  };

  const completeBooking = (id) => updateBookingStatus(id, 'Completed');
  const cancelBooking = (id) => updateBookingStatus(id, 'Cancelled');

  const deleteBooking = async (id) => {
    try {
      const bookingToDelete = bookings.find((b) => b.id === id);
      await bookingService.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));

      if (
        bookingToDelete &&
        (bookingToDelete.status === 'Active' || bookingToDelete.status === 'Confirmed') &&
        bookingToDelete.carId
      ) {
        setCars((prev) =>
          prev.map((c) =>
            c.id === bookingToDelete.carId ? { ...c, availability: 'Available' } : c
          )
        );
      }

      toast.success(`Booking ${id} deleted.`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete booking.');
      throw err;
    }
  };

  const getBookingById = useCallback(
    (id) => {
      return bookings.find((b) => String(b.id) === String(id));
    },
    [bookings]
  );

  // Reset to default fleet
  const resetFleetToDefault = () => {
    const defaultCars = carService.resetFleet();
    setCars(defaultCars);
    toast.info('Fleet reset to default catalogue.');
  };

  // Computed filtered & sorted cars
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Search term (matches brand, model, or year)
        if (filters.search) {
          const q = filters.search.toLowerCase().trim();
          const matchesBrand = car.brand?.toLowerCase().includes(q);
          const matchesModel = car.model?.toLowerCase().includes(q);
          const matchesYear = String(car.year).includes(q);
          if (!matchesBrand && !matchesModel && !matchesYear) {
            return false;
          }
        }

        // Brand filter
        if (filters.brand !== 'All' && car.brand !== filters.brand) {
          return false;
        }

        // Fuel Type filter
        if (filters.fuelType !== 'All' && car.fuelType !== filters.fuelType) {
          return false;
        }

        // Transmission filter
        if (
          filters.transmission !== 'All' &&
          car.transmission !== filters.transmission
        ) {
          return false;
        }

        // Availability filter
        if (
          filters.availability !== 'All' &&
          car.availability !== filters.availability
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') {
          return a.pricePerDay - b.pricePerDay;
        }
        if (filters.sortBy === 'price-desc') {
          return b.pricePerDay - a.pricePerDay;
        }
        if (filters.sortBy === 'year-desc') {
          return b.year - a.year;
        }
        if (filters.sortBy === 'year-asc') {
          return a.year - b.year;
        }
        return 0; // 'featured' retains original order
      });
  }, [cars, filters]);

  // Unique brand names for filter dropdown
  const availableBrands = useMemo(() => {
    const brands = new Set(cars.map((c) => c.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [cars]);

  // Computed dashboard statistics
  const stats = useMemo(() => {
    const totalCars = cars.length;
    const availableCars = cars.filter((c) => c.availability === 'Available').length;
    const bookedCars = cars.filter((c) => c.availability === 'Booked').length;
    const maintenanceCars = cars.filter(
      (c) => c.availability === 'Maintenance'
    ).length;
    const activeRentals = bookings.filter((b) => b.status === 'Active' || b.status === 'Confirmed').length;
    const completedRentals = bookings.filter((b) => b.status === 'Completed').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled').length;
    const totalCustomers = customers.length;
    const totalRevenue =
      DUMMY_REVENUE.total +
      bookings
        .filter((b) => b.status !== 'Cancelled')
        .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    return {
      totalCars,
      availableCars,
      bookedCars,
      maintenanceCars,
      activeRentals,
      completedRentals,
      cancelledBookings,
      totalCustomers,
      totalRevenue,
      revenueData: DUMMY_REVENUE,
    };
  }, [cars, bookings, customers]);

  return (
    <CarContext.Provider
      value={{
        cars,
        filteredCars,
        bookings,
        customers,
        loading,
        error,
        filters,
        availableBrands,
        stats,
        setFilter,
        resetFilters,
        addCar,
        updateCar,
        deleteCar,
        getCarById,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
        addBooking,
        updateBookingStatus,
        completeBooking,
        cancelBooking,
        deleteBooking,
        getBookingById,
        refreshData: loadInitialData,
        refreshCars: loadInitialData,
        resetFleetToDefault,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export { useCars } from './useCars';
