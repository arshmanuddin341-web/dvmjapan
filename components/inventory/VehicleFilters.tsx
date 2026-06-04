"use client";

import { motion } from "framer-motion";
import { FilterProps } from "@/types/inventory";

export default function VehicleFilters({ filters, setFilters, makes }: FilterProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Make */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-bold text-white mb-2">Make</label>
        <select
          value={filters.make}
          onChange={(e) => handleFilterChange("make", e.target.value)}
          className="input-field"
        >
          <option value="">All Makes</option>
          {makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Year Range */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-bold text-white mb-2">Year</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minYear}
            onChange={(e) => handleFilterChange("minYear", e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxYear}
            onChange={(e) => handleFilterChange("maxYear", e.target.value)}
            className="input-field"
          />
        </div>
      </motion.div>

      {/* Price Range */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-bold text-white mb-2">Price (USD)</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="input-field"
          />
        </div>
      </motion.div>

      {/* Fuel Type */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-bold text-white mb-2">Fuel Type</label>
        <select
          value={filters.fuel}
          onChange={(e) => handleFilterChange("fuel", e.target.value)}
          className="input-field"
        >
          <option value="">All Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Electric">Electric</option>
        </select>
      </motion.div>

      {/* Transmission */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="block text-sm font-bold text-white mb-2">Transmission</label>
        <select
          value={filters.transmission}
          onChange={(e) => handleFilterChange("transmission", e.target.value)}
          className="input-field"
        >
          <option value="">All Types</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
          <option value="CVT">CVT</option>
        </select>
      </motion.div>

      {/* Mileage Range */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label className="block text-sm font-bold text-white mb-2">Mileage (km)</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minMileage}
            onChange={(e) => handleFilterChange("minMileage", e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxMileage}
            onChange={(e) => handleFilterChange("maxMileage", e.target.value)}
            className="input-field"
          />
        </div>
      </motion.div>

      {/* Clear Filters */}
      <motion.button
        onClick={() => setFilters({
          make: "",
          model: "",
          minYear: "",
          maxYear: "",
          minPrice: "",
          maxPrice: "",
          fuel: "",
          transmission: "",
          minMileage: "",
          maxMileage: "",
        })}
        className="w-full btn-secondary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        Clear All Filters
      </motion.button>
    </div>
  );
}
