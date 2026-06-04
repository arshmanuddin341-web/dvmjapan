import { Vehicle } from "@/types";

/**
 * Static vehicles removed to prioritize live database inventory.
 * We now fetch all vehicle data from the PostgreSQL database via /api/vehicles.
 */
export const vehicles: Vehicle[] = [];

export function getVehicleById(id: string): Vehicle | undefined {
  return undefined;
}

export function getVehiclesByMake(make: string): Vehicle[] {
  return [];
}

export function getAllMakes(): string[] {
  return ["TOYOTA", "HONDA", "NISSAN", "MAZDA", "MITSUBISHI", "SUZUKI", "SUBARU", "LEXUS", "DAIHATSU", "BMW", "MERCEDES", "AUDI", "VOLKSWAGEN", "HINO", "ISUZU"];
}

export function getModelsByMake(make: string): string[] {
  return [];
}

export function getBodyTypes(): string[] {
  return ["SUV", "Hatchback", "Sedan", "MPV", "Station Wagon", "Truck", "Van", "Coupe", "Convertible"];
}
