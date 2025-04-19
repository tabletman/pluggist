"use client";

import { useState } from "react";
import { SearchFilters, FilterOptions } from "./search-filters";
import { LocationInput } from "./location-input";

export function SearchFiltersContainer() {
  const [location, setLocation] = useState("");
  
  const handleLocationChange = (value: string) => {
    setLocation(value);
  };
  
  const handleApplyFilters = (filters: FilterOptions) => {
    // Will be implemented when connected to actual data
    console.log("Applied filters:", filters);
    console.log("Current location:", location);
  };
  
  return (
    <>
      <LocationInput onChange={handleLocationChange} />
      <SearchFilters onApplyFilters={handleApplyFilters} />
    </>
  );
}