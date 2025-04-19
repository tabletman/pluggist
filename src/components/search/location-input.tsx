"use client";

import { useState, useEffect } from "react";

interface LocationInputProps {
  onChange?: (value: string) => void;
}

export function LocationInput({ onChange }: LocationInputProps = {}) {
  const [isClient, setIsClient] = useState(false);
  const [location, setLocation] = useState("");
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    if (onChange) {
      onChange(value);
    }
  };

  // Only render the actual component on the client side
  if (!isClient) {
    return (
      <div className="mb-4 animate-pulse">
        <div className="h-5 bg-muted rounded w-1/4 mb-1"></div>
        <div className="h-10 bg-muted rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor="location" className="block text-sm font-medium mb-1">
        Location
      </label>
      <input
        type="text"
        id="location"
        value={location}
        onChange={handleChange}
        placeholder="Enter address, city, or zip code"
        className="w-full px-3 py-2 border rounded-md text-sm"
      />
    </div>
  );
}