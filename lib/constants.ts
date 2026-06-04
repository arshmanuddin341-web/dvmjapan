/**
 * APPLICATION CONSTANTS
 * Centralized constants used throughout the application
 */

/**
 * Vehicle-related constants
 */
export const vehicleConstants = {
  makes: [
    'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi',
    'Suzuki', 'Daihatsu', 'Isuzu', 'Lexus', 'Acura', 'Infiniti',
  ],
  bodyTypes: [
    'SUV', 'Sedan', 'Hatchback', 'Wagon', 'Van', 'Coupe', 'Pickup',
    'Convertible', 'MPV', 'Truck',
  ],
  fuelTypes: [
    'Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'LPG',
  ],
  transmissionTypes: [
    'Automatic', 'Manual', 'CVT', 'DCT',
  ],
  driveTypes: [
    'FWD', 'RWD', 'AWD', '4WD',
  ],
  colors: [
    'White', 'Black', 'Silver', 'Gray', 'Blue', 'Red', 'Green',
    'Yellow', 'Orange', 'Brown', 'Beige', 'Gold', 'Purple', 'Pink',
  ],
  auctionGrades: [
    'S', '6', '5', '4.5', '4', '3.5', '3', '2', '1', 'R', 'RA',
  ],
  conditions: [
    'Excellent', 'Very Good', 'Good', 'Fair', 'Poor',
  ],
} as const;

/**
 * Country/Region constants
 */
export const countryConstants = {
  regions: [
    { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
    { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
    { name: 'UK', code: 'GB', flag: '🇬🇧' },
    { name: 'Uganda', code: 'UG', flag: '🇺🇬' },
    { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
    { name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
    { name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
    { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
    { name: 'Trinidad & Tobago', code: 'TT', flag: '🇹🇹' },
    { name: 'Mauritius', code: 'MU', flag: '🇲🇺' },
  ],
} as const;

/**
 * Pricing constants
 */
export const pricingConstants = {
  currency: {
    default: 'USD',
    jpy: 'JPY',
    usd: 'USD',
    eur: 'EUR',
    gbp: 'GBP',
  },
  shippingZones: {
    asia: { base: 800, perKm: 0.5 },
    europe: { base: 1200, perKm: 0.8 },
    americas: { base: 1500, perKm: 1.0 },
    africa: { base: 1800, perKm: 1.2 },
    oceania: { base: 2000, perKm: 1.5 },
  },
  serviceFees: {
    inspection: 150,
    documentation: 100,
    handling: 200,
    insurance: 50,
  },
} as const;

/**
 * UI constants
 */
export const uiConstants = {
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1280,
    large: 1536,
  },
  containerMaxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    section: {
      mobile: '3rem',
      desktop: '5rem',
    },
    container: {
      mobile: '1rem',
      desktop: '2rem',
    },
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

/**
 * Animation constants
 */
export const animationConstants = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

/**
 * Form validation constants
 */
export const validationConstants = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
  },
  phone: {
    pattern: /^[\d\s\-\+\(\)]+$/,
    minLength: 10,
    maxLength: 20,
  },
  name: {
    minLength: 2,
    maxLength: 100,
  },
  message: {
    minLength: 10,
    maxLength: 2000,
  },
  stockId: {
    pattern: /^[A-Z0-9\-]+$/,
    minLength: 5,
    maxLength: 20,
  },
} as const;

/**
 * Pagination constants
 */
export const paginationConstants = {
  defaultPageSize: 12,
  pageSizeOptions: [12, 24, 48, 96],
  maxPageSize: 100,
} as const;

/**
 * Search constants
 */
export const searchConstants = {
  debounceDelay: 300,
  minQueryLength: 2,
  maxResults: 50,
  highlightClass: 'bg-yellow-200 text-yellow-900',
} as const;

/**
 * API constants
 */
export const apiConstants = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

/**
 * Date/Time constants
 */
export const dateConstants = {
  dateFormat: 'YYYY-MM-DD',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  displayDateFormat: 'MMM DD, YYYY',
  timezone: 'Asia/Tokyo',
} as const;
