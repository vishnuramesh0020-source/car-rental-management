import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { carService } from '../services/api';
import { DUMMY_REVENUE, INITIAL_CUSTOMERS } from '../services/seedData';
import { toast } from 'react-toastify';

export const CarContext = createContext(null);

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers] = useState(INITIAL_CUSTOMERS);
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

  // Fetch cars & bookings on mount
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedCars, fetchedBookings] = await Promise.all([
        carService.getCars(),
        carService.getBookings(),
      ]);
      setCars(fetchedCars);
      setBookings(fetchedBookings);
    } catch (err) {
      console.error('Failed to load fleet data:', err);
      setError(err.message || 'Failed to fetch car data.');
      toast.error('Failed to fetch car data. Please try again.');
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

  // Add booking
  const addBooking = async (bookingData) => {
    try {
      const newBooking = await carService.createBooking(bookingData);
      setBookings((prev) => [newBooking, ...prev]);

      // Update car status locally if booked
      if (bookingData.carId) {
        setCars((prev) =>
          prev.map((c) =>
            c.id === bookingData.carId ? { ...c, availability: 'Booked' } : c
          )
        );
      }

      toast.success(`Booking confirmed for ${newBooking.customerName}!`);
      return newBooking;
    } catch (err) {
      toast.error(err.message || 'Booking failed.');
      throw err;
    }
  };

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
    const activeRentals = bookings.filter((b) => b.status === 'Active').length;
    const totalCustomers = customers.length + 19; // baseline plus seeds
    const totalRevenue =
      DUMMY_REVENUE.total +
      bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    return {
      totalCars,
      availableCars,
      bookedCars,
      maintenanceCars,
      activeRentals,
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
        addBooking,
        refreshCars: loadInitialData,
        resetFleetToDefault,
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export { useCars } from './useCars';
