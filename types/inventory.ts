export interface FilterState {
  make: string;
  model: string;
  minYear: string;
  maxYear: string;
  minPrice: string;
  maxPrice: string;
  fuel: string;
  transmission: string;
  minMileage: string;
  maxMileage: string;
  bodyType?: string;
  color?: string;
  location?: string;
  stockId?: string;
  minCC?: string;
  maxCC?: string;
  driveType?: string;
  auctionGrade?: string;
  condition?: string;
}

export interface FilterOptions {
  makes: string[];
  models: string[];
  transmissions: string[];
  fuelTypes: string[];
  locations: string[];
  bodyTypes?: string[];
  colors?: string[];
  driveTypes?: string[];
  auctionGrades?: string[];
  conditions?: string[];
}

export interface FilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  makes: string[];
  /** When provided, dropdowns use live API data instead of static lists */
  filterOptions?: FilterOptions;
}
