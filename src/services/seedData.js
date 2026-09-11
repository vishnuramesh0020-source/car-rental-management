// Seed data for initial Car Fleet, Bookings, and Dashboard metrics

export const DEMO_CREDENTIALS = {
  email: 'admin@carrental.com',
  password: 'password123',
};

export const INITIAL_CARS = [
  {
    id: "car-1",
    brand: "Tesla",
    model: "Model 3 Performance",
    year: 2024,
    pricePerDay: 120,
    fuelType: "Electric",
    transmission: "Automatic",
    seatingCapacity: 5,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80",
    description: "Dual motor all-wheel drive, carbon fiber spoiler, and 0-60 mph in 2.9 seconds with premium connectivity.",
    mileage: "8,500 mi",
    rating: 4.95,
    features: ["Autopilot", "Glass Roof", "Wireless Charging", "Heated Seats", "Premium Audio"]
  },
  {
    id: "car-2",
    brand: "BMW",
    model: "M4 Competition Coupe",
    year: 2023,
    pricePerDay: 195,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 4,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80",
    description: "503 horsepower twin-turbo inline 6-cylinder engine delivering track-ready thrills with daily luxury.",
    mileage: "14,200 mi",
    rating: 4.9,
    features: ["M Drive", "Harman Kardon Audio", "Head-Up Display", "Adaptive Suspension", "Carbon Trim"]
  },
  {
    id: "car-3",
    brand: "Mercedes-Benz",
    model: "C300 AMG Line",
    year: 2024,
    pricePerDay: 145,
    fuelType: "Hybrid",
    transmission: "Automatic",
    seatingCapacity: 5,
    availability: "Booked",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
    description: "Sophisticated styling, MBUX intuitive infotainment system, and mild-hybrid turbocharged efficiency.",
    mileage: "11,100 mi",
    rating: 4.88,
    features: ["Panoramic Sunroof", "Burmester Surround Sound", "Ambient Lighting", "Active Brake Assist"]
  },
  {
    id: "car-4",
    brand: "Porsche",
    model: "911 Carrera S",
    year: 2024,
    pricePerDay: 320,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 4,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    description: "Iconic rear-engine sports car with 443 hp twin-turbo boxer six and lightning-fast 8-speed PDK transmission.",
    mileage: "5,300 mi",
    rating: 4.98,
    features: ["Sport Chrono Package", "PASM Suspension", "Sport Exhaust", "Apple CarPlay", "Bose Audio"]
  },
  {
    id: "car-5",
    brand: "Audi",
    model: "RS6 Avant Performance",
    year: 2023,
    pricePerDay: 260,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 5,
    availability: "Booked",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80",
    description: "The ultimate supercar wagon combining twin-turbo V8 firepower with quattro all-wheel drive and family utility.",
    mileage: "18,400 mi",
    rating: 4.92,
    features: ["Quattro AWD", "Bang & Olufsen 3D", "Matrix LED Headlights", "Carbon Ceramic Brakes"]
  },
  {
    id: "car-6",
    brand: "Ford",
    model: "Mustang GT 5.0",
    year: 2023,
    pricePerDay: 110,
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 4,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80",
    description: "Raw American muscle power powered by the legendary 5.0L Coyote V8 paired with a crisp 6-speed manual box.",
    mileage: "16,900 mi",
    rating: 4.82,
    features: ["6-Speed Manual", "Active Valve Exhaust", "Track Apps", "SYNC 4 Infotainment", "Recaro Seats"]
  },
  {
    id: "car-7",
    brand: "Toyota",
    model: "Camry XSE Hybrid",
    year: 2024,
    pricePerDay: 65,
    fuelType: "Hybrid",
    transmission: "Automatic",
    seatingCapacity: 5,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80",
    description: "Exceptional fuel economy of 52 MPG, comfortable leather-trimmed cabin, and Toyota Safety Sense 3.0.",
    mileage: "9,100 mi",
    rating: 4.75,
    features: ["Toyota Safety Sense", "Dual Exhaust", "Wireless CarPlay", "Blind Spot Monitor"]
  },
  {
    id: "car-8",
    brand: "Hyundai",
    model: "Tucson Ultimate AWD",
    year: 2024,
    pricePerDay: 75,
    fuelType: "Diesel",
    transmission: "Automatic",
    seatingCapacity: 5,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
    description: "Futuristic parametric styling, spacious family cabin, smart power tailgate, and confidence-inspiring HTRAC AWD.",
    mileage: "12,600 mi",
    rating: 4.7,
    features: ["HTRAC All-Wheel Drive", "Panoramic Roof", "Surround View Monitor", "Ventilated Seats"]
  },
  {
    id: "car-9",
    brand: "Honda",
    model: "Civic Type R",
    year: 2024,
    pricePerDay: 135,
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 4,
    availability: "Maintenance",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=80",
    description: "Pure driving engagement with rev-matching 6-speed manual, Brembo 4-piston calipers, and race-tuned aerodynamic chassis.",
    mileage: "7,800 mi",
    rating: 4.91,
    features: ["Rev-Match Manual", "LogR Telemetry", "Brembo Brakes", "Sport Bucket Seats"]
  },
  {
    id: "car-10",
    brand: "Toyota",
    model: "Land Cruiser Prado",
    year: 2024,
    pricePerDay: 180,
    fuelType: "Diesel",
    transmission: "Automatic",
    seatingCapacity: 7,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80",
    description: "True go-anywhere luxury SUV equipped with 7 comfortable seats, multi-terrain select, crawl control, and high ground clearance.",
    mileage: "15,400 mi",
    rating: 4.89,
    features: ["7 Seats", "Multi-Terrain Monitor", "Crawl Control", "Cool Box", "JBL Premium Audio"]
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: "BKG-901",
    customerName: "Alexander Wright",
    customerEmail: "a.wright@enterprise.com",
    carId: "car-3",
    carName: "Mercedes-Benz C300 AMG",
    startDate: "2026-09-08",
    endDate: "2026-09-14",
    totalDays: 6,
    totalAmount: 870,
    status: "Active"
  },
  {
    id: "BKG-902",
    customerName: "Sophia Martinez",
    customerEmail: "sophia.m@gmail.com",
    carId: "car-5",
    carName: "Audi RS6 Avant Performance",
    startDate: "2026-09-09",
    endDate: "2026-09-13",
    totalDays: 4,
    totalAmount: 1040,
    status: "Active"
  },
  {
    id: "BKG-903",
    customerName: "Liam Johnson",
    customerEmail: "liam.j@outlook.com",
    carId: "car-1",
    carName: "Tesla Model 3 Performance",
    startDate: "2026-09-02",
    endDate: "2026-09-06",
    totalDays: 4,
    totalAmount: 480,
    status: "Completed"
  },
  {
    id: "BKG-904",
    customerName: "Emma Watson",
    customerEmail: "emma.w@travelco.org",
    carId: "car-4",
    carName: "Porsche 911 Carrera S",
    startDate: "2026-09-12",
    endDate: "2026-09-16",
    totalDays: 4,
    totalAmount: 1280,
    status: "Confirmed"
  },
  {
    id: "BKG-905",
    customerName: "David Chen",
    customerEmail: "david.c@techventure.io",
    carId: "car-7",
    carName: "Toyota Camry XSE Hybrid",
    startDate: "2026-09-15",
    endDate: "2026-09-20",
    totalDays: 5,
    totalAmount: 325,
    status: "Confirmed"
  }
];

export const INITIAL_CUSTOMERS = [
  { id: "cust-1", name: "Alexander Wright", email: "a.wright@enterprise.com", phone: "+91 98765 43210", totalRentals: 4, spent: 3450 },
  { id: "cust-2", name: "Sophia Martinez", email: "sophia.m@gmail.com", phone: "+91 98765 43211", totalRentals: 3, spent: 2980 },
  { id: "cust-3", name: "Liam Johnson", email: "liam.j@outlook.com", phone: "+91 98765 43212", totalRentals: 6, spent: 4120 },
  { id: "cust-4", name: "Emma Watson", email: "emma.w@travelco.org", phone: "+91 98765 43213", totalRentals: 2, spent: 2100 },
  { id: "cust-5", name: "David Chen", email: "david.c@techventure.io", phone: "+91 98765 43214", totalRentals: 5, spent: 3890 }
];

export const DUMMY_REVENUE = {
  total: 48650,
  monthly: 14280,
  growthPercent: 12.8,
  averageRentalValue: 385,
  weeklyTrend: [
    { day: "Mon", amount: 1650 },
    { day: "Tue", amount: 2100 },
    { day: "Wed", amount: 1850 },
    { day: "Thu", amount: 2450 },
    { day: "Fri", amount: 3100 },
    { day: "Sat", amount: 3950 },
    { day: "Sun", amount: 3200 }
  ]
};
