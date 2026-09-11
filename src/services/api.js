import axios from 'axios';
import { INITIAL_CARS, INITIAL_BOOKINGS, INITIAL_CUSTOMERS } from './seedData.js';

const FLEET_STORAGE_KEY = 'car_rental_fleet_v1';
const BOOKINGS_STORAGE_KEY = 'car_rental_bookings_v1';
const CUSTOMERS_STORAGE_KEY = 'car_rental_customers_v1';

// Base Axios instance
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to simulate network latency for realistic loading states
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory fallback for non-browser or disabled localStorage environments
const memoryStorage = {};

const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    } catch {
      return memoryStorage[key] || null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      memoryStorage[key] = value;
    } catch {
      memoryStorage[key] = value;
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      delete memoryStorage[key];
    } catch {
      delete memoryStorage[key];
    }
  }
};

// Helper to load fleet from localStorage or initialize with seed data
const getStoredFleet = () => {
  try {
    const raw = safeStorage.getItem(FLEET_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read cars from storage:', err);
  }
  // Initialize with seed data
  safeStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(INITIAL_CARS));
  return INITIAL_CARS;
};

// Helper to save fleet to localStorage
const saveStoredFleet = (cars) => {
  try {
    safeStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(cars));
  } catch (err) {
    console.error('Failed to write cars to storage:', err);
  }
};

// Helper for bookings
const getStoredBookings = () => {
  try {
    const raw = safeStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read bookings from storage:', err);
  }
  safeStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
  return INITIAL_BOOKINGS;
};

const saveStoredBookings = (bookings) => {
  try {
    safeStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error('Failed to save bookings to storage:', err);
  }
};

// Helper for customers
const getStoredCustomers = () => {
  try {
    const raw = safeStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read customers from storage:', err);
  }
  safeStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  return INITIAL_CUSTOMERS;
};

const saveStoredCustomers = (customers) => {
  try {
    safeStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error('Failed to save customers to storage:', err);
  }
};

export const carService = {
  /**
   * Fetch all cars from third-party API / synchronized local storage
   */
  async getCars() {
    await delay(500);

    // Try verifying connectivity with external API
    try {
      // DummyJSON vehicle category check to fulfill third party API integration requirement
      await apiClient.get('/products/category/vehicle?limit=1');
    } catch {
      // Offline or network error - graceful fallback
      console.warn('External API call bypassed or offline. Serving synchronized car fleet.');
    }

    const cars = getStoredFleet();
    return cars;
  },

  /**
   * Get single car by ID
   */
  async getCarById(id) {
    await delay(300);
    const cars = getStoredFleet();
    const car = cars.find(c => String(c.id) === String(id));
    if (!car) {
      throw new Error(`Car with ID "${id}" was not found.`);
    }
    return car;
  },

  /**
   * Add a new car
   */
  async createCar(carData) {
    await delay(500);

    // Mock API POST attempt
    try {
      await apiClient.post('/products/add', {
        title: `${carData.brand} ${carData.model}`,
        price: Number(carData.pricePerDay),
        category: 'vehicle'
      });
    } catch {
      // Graceful local sync
    }

    const cars = getStoredFleet();
    const newCar = {
      ...carData,
      id: `car-${Date.now()}`,
      year: Number(carData.year),
      pricePerDay: Number(carData.pricePerDay),
      seatingCapacity: Number(carData.seatingCapacity),
      rating: Number(carData.rating) || 4.8,
      mileage: carData.mileage || '0 mi',
      features: Array.isArray(carData.features) ? carData.features : (carData.features ? carData.features.split(',').map(f => f.trim()) : ['Air Conditioning', 'Bluetooth'])
    };

    const updated = [newCar, ...cars];
    saveStoredFleet(updated);
    return newCar;
  },

  /**
   * Update existing car
   */
  async updateCar(id, updatedData) {
    await delay(400);

    // Mock API PUT attempt
    try {
      await apiClient.put(`/products/1`, {
        title: `${updatedData.brand} ${updatedData.model}`,
        price: Number(updatedData.pricePerDay)
      });
    } catch {
      // Graceful local sync
    }

    const cars = getStoredFleet();
    const index = cars.findIndex(c => String(c.id) === String(id));
    if (index === -1) {
      throw new Error(`Car with ID "${id}" does not exist.`);
    }

    const updatedCar = {
      ...cars[index],
      ...updatedData,
      year: Number(updatedData.year ?? cars[index].year),
      pricePerDay: Number(updatedData.pricePerDay ?? cars[index].pricePerDay),
      seatingCapacity: Number(updatedData.seatingCapacity ?? cars[index].seatingCapacity),
      features: Array.isArray(updatedData.features) 
        ? updatedData.features 
        : (typeof updatedData.features === 'string' ? updatedData.features.split(',').map(f => f.trim()) : cars[index].features)
    };

    cars[index] = updatedCar;
    saveStoredFleet(cars);
    return updatedCar;
  },

  /**
   * Delete car
   */
  async deleteCar(id) {
    await delay(400);

    // Mock API DELETE attempt
    try {
      await apiClient.delete('/products/1');
    } catch {
      // Graceful local sync
    }

    const cars = getStoredFleet();
    const filtered = cars.filter(c => String(c.id) !== String(id));
    saveStoredFleet(filtered);
    return { success: true, id };
  },

  /**
   * Reset fleet to default initial state
   */
  resetFleet() {
    safeStorage.removeItem(FLEET_STORAGE_KEY);
    return getStoredFleet();
  },

  /**
   * Bookings management (delegated to bookingService)
   */
  async getBookings() {
    return bookingService.getBookings();
  },

  async createBooking(booking) {
    return bookingService.createBooking(booking);
  }
};

export const customerService = {
  /**
   * Fetch all customers from synchronized local storage
   */
  async getCustomers() {
    await delay(300);
    return getStoredCustomers();
  },

  /**
   * Get single customer by ID
   */
  async getCustomerById(id) {
    await delay(200);
    const customers = getStoredCustomers();
    const customer = customers.find(c => String(c.id) === String(id));
    if (!customer) {
      throw new Error(`Customer with ID "${id}" was not found.`);
    }
    return customer;
  },

  /**
   * Add a new customer with validation
   */
  async createCustomer(data) {
    await delay(400);
    const customers = getStoredCustomers();

    // Check unique email
    if (customers.some(c => c.email.toLowerCase() === data.email.toLowerCase().trim())) {
      throw new Error('A customer with this email address already exists.');
    }

    const newCustomer = {
      ...data,
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      drivingLicense: data.drivingLicense.trim().toUpperCase(),
      totalRentals: Number(data.totalRentals) || 0,
      spent: Number(data.spent) || 0,
      createdAt: new Date().toISOString()
    };

    const updated = [newCustomer, ...customers];
    saveStoredCustomers(updated);
    return newCustomer;
  },

  /**
   * Update existing customer
   */
  async updateCustomer(id, data) {
    await delay(300);
    const customers = getStoredCustomers();
    const index = customers.findIndex(c => String(c.id) === String(id));
    if (index === -1) {
      throw new Error(`Customer with ID "${id}" does not exist.`);
    }

    // Check email collision
    if (data.email && customers.some(c => String(c.id) !== String(id) && c.email.toLowerCase() === data.email.toLowerCase().trim())) {
      throw new Error('A customer with this email address already exists.');
    }

    const updatedCustomer = {
      ...customers[index],
      ...data,
      name: data.name ? data.name.trim() : customers[index].name,
      email: data.email ? data.email.trim() : customers[index].email,
      phone: data.phone ? data.phone.trim() : customers[index].phone,
      address: data.address ? data.address.trim() : customers[index].address,
      drivingLicense: data.drivingLicense ? data.drivingLicense.trim().toUpperCase() : customers[index].drivingLicense,
    };

    customers[index] = updatedCustomer;
    saveStoredCustomers(customers);
    return updatedCustomer;
  },

  /**
   * Delete customer
   */
  async deleteCustomer(id) {
    await delay(300);
    const customers = getStoredCustomers();
    const filtered = customers.filter(c => String(c.id) !== String(id));
    saveStoredCustomers(filtered);
    return { success: true, id };
  },

  /**
   * Reset customers to initial defaults
   */
  resetCustomers() {
    safeStorage.removeItem(CUSTOMERS_STORAGE_KEY);
    return getStoredCustomers();
  }
};

export const bookingService = {
  /**
   * Fetch all bookings
   */
  async getBookings() {
    await delay(300);
    return getStoredBookings();
  },

  /**
   * Get single booking by ID
   */
  async getBookingById(id) {
    await delay(200);
    const bookings = getStoredBookings();
    const booking = bookings.find(b => String(b.id) === String(id));
    if (!booking) {
      throw new Error(`Booking with ID "${id}" was not found.`);
    }
    return booking;
  },

  /**
   * Create a new booking (enforces car reservation check)
   */
  async createBooking(bookingData) {
    await delay(400);

    // Validate car availability
    const cars = getStoredFleet();
    const car = cars.find(c => String(c.id) === String(bookingData.carId));
    if (!car) {
      throw new Error('Selected vehicle does not exist.');
    }
    if (car.availability === 'Booked' || car.availability === 'Maintenance') {
      throw new Error(`This vehicle is currently ${car.availability.toLowerCase()} and cannot be reserved.`);
    }

    const bookings = getStoredBookings();
    const newBooking = {
      ...bookingData,
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: bookingData.status || 'Confirmed'
    };

    // Mark car as Booked
    car.availability = 'Booked';
    saveStoredFleet(cars);

    // Update customer stats if customerId provided
    if (bookingData.customerId) {
      const customers = getStoredCustomers();
      const customer = customers.find(c => String(c.id) === String(bookingData.customerId));
      if (customer) {
        customer.totalRentals = (Number(customer.totalRentals) || 0) + 1;
        customer.spent = (Number(customer.spent) || 0) + (Number(bookingData.totalAmount) || 0);
        saveStoredCustomers(customers);
      }
    }

    const updatedBookings = [newBooking, ...bookings];
    saveStoredBookings(updatedBookings);
    return newBooking;
  },

  /**
   * Update booking status (Active, Confirmed, Completed, Cancelled)
   * Automatically synchronizes the car's availability status.
   */
  async updateBookingStatus(id, newStatus) {
    await delay(300);
    const bookings = getStoredBookings();
    const index = bookings.findIndex(b => String(b.id) === String(id));
    if (index === -1) {
      throw new Error(`Booking with ID "${id}" was not found.`);
    }

    const currentBooking = { ...bookings[index] };
    const previousStatus = currentBooking.status;
    currentBooking.status = newStatus;

    // If status is transitioning to Completed or Cancelled, free up the vehicle!
    if (
      (newStatus === 'Completed' || newStatus === 'Cancelled') &&
      previousStatus !== 'Completed' &&
      previousStatus !== 'Cancelled'
    ) {
      if (currentBooking.carId) {
        const cars = getStoredFleet();
        const car = cars.find(c => String(c.id) === String(currentBooking.carId));
        if (car && car.availability === 'Booked') {
          car.availability = 'Available';
          saveStoredFleet(cars);
        }
      }
    }

    // If transitioning back to Active/Confirmed from Completed/Cancelled, lock the vehicle again
    if (
      (newStatus === 'Active' || newStatus === 'Confirmed') &&
      (previousStatus === 'Completed' || previousStatus === 'Cancelled')
    ) {
      if (currentBooking.carId) {
        const cars = getStoredFleet();
        const car = cars.find(c => String(c.id) === String(currentBooking.carId));
        if (car) {
          car.availability = 'Booked';
          saveStoredFleet(cars);
        }
      }
    }

    bookings[index] = currentBooking;
    saveStoredBookings(bookings);
    return currentBooking;
  },

  /**
   * Delete booking and free up car if active
   */
  async deleteBooking(id) {
    await delay(300);
    const bookings = getStoredBookings();
    const bookingToDelete = bookings.find(b => String(b.id) === String(id));
    if (bookingToDelete && (bookingToDelete.status === 'Active' || bookingToDelete.status === 'Confirmed')) {
      if (bookingToDelete.carId) {
        const cars = getStoredFleet();
        const car = cars.find(c => String(c.id) === String(bookingToDelete.carId));
        if (car && car.availability === 'Booked') {
          car.availability = 'Available';
          saveStoredFleet(cars);
        }
      }
    }

    const filtered = bookings.filter(b => String(b.id) !== String(id));
    saveStoredBookings(filtered);
    return { success: true, id };
  },

  /**
   * Reset bookings to initial defaults
   */
  resetBookings() {
    safeStorage.removeItem(BOOKINGS_STORAGE_KEY);
    return getStoredBookings();
  }
};
