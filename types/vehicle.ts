/**
 * VEHICLE TYPE DEFINITIONS
 * TypeScript types for vehicle-related data structures
 */

export interface Vehicle {
  id: string;
  stockId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  driveType: string;
  engineSize: number;
  location: string;
  condition: string;
  auctionGrade?: string;
  images: string[];
  description: string;
  features: string[];
  specifications: VehicleSpecifications;
  documents?: VehicleDocument[];
  status: 'available' | 'sold' | 'reserved' | 'pending';
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleSpecifications {
  engine: {
    type: string;
    displacement: number;
    cylinders: number;
    power: number;
    torque?: number;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
    groundClearance?: number;
  };
  weight: {
    curb: number;
    gross?: number;
  };
  performance: {
    topSpeed?: number;
    acceleration?: number;
    fuelEconomy?: {
      city: number;
      highway: number;
      combined: number;
    };
  };
  features: {
    safety: string[];
    comfort: string[];
    technology: string[];
    exterior: string[];
    interior: string[];
  };
}

export interface VehicleDocument {
  id: string;
  type: 'auction-sheet' | 'inspection-report' | 'export-certificate' | 'other';
  name: string;
  url: string;
  size?: number;
  format?: string;
  uploadedAt: string;
}

export interface VehicleFilter {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  minMileage?: number;
  maxMileage?: number;
  color?: string;
  location?: string;
  stockId?: string;
  condition?: string;
  auctionGrade?: string;
  driveType?: string;
  minEngineSize?: number;
  maxEngineSize?: number;
}

export interface VehicleSortOption {
  field: 'price' | 'year' | 'mileage' | 'createdAt' | 'make' | 'model';
  direction: 'asc' | 'desc';
}

export interface VehicleSearchParams {
  query?: string;
  filters?: VehicleFilter;
  sort?: VehicleSortOption;
  page?: number;
  pageSize?: number;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface VehicleStats {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  byMake: Record<string, number>;
  byBodyType: Record<string, number>;
  byFuelType: Record<string, number>;
  averagePrice: number;
  averageMileage: number;
}
