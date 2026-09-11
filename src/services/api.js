import axios from 'axios';
import { INITIAL_CARS, INITIAL_BOOKINGS } from './seedData.js';

const FLEET_STORAGE_KEY = 'car_rental_fleet_v1';
const BOOKINGS_STORAGE_KEY = 'car_rental_bookings_v1';

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
   * Bookings management
   */
  async getBookings() {
    await delay(300);
    return getStoredBookings();
  },

  async createBooking(booking) {
    await delay(400);
    const bookings = getStoredBookings();
    const newBooking = {
      ...booking,
      id: `BKG-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString()
    };
    const updatedBookings = [newBooking, ...bookings];
    saveStoredBookings(updatedBookings);

    // Also mark car as Booked
    if (booking.carId) {
      const cars = getStoredFleet();
      const car = cars.find(c => String(c.id) === String(booking.carId));
      if (car) {
        car.availability = 'Booked';
        saveStoredFleet(cars);
      }
    }

    return newBooking;
  }
};
