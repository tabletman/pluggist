"use client";

import { useState, useEffect } from "react";

// Comprehensive list of EVs organized by manufacturer
const vehicleOptions = [
  {
    manufacturer: "Tesla",
    models: [
      { id: "tesla_model_3", name: "Model 3" },
      { id: "tesla_model_y", name: "Model Y" },
      { id: "tesla_model_s", name: "Model S" },
      { id: "tesla_model_x", name: "Model X" },
      { id: "tesla_cybertruck", name: "Cybertruck" },
    ]
  },
  {
    manufacturer: "Chevrolet",
    models: [
      { id: "chevy_bolt_ev", name: "Bolt EV" },
      { id: "chevy_bolt_euv", name: "Bolt EUV" },
      { id: "chevy_blazer_ev", name: "Blazer EV" },
      { id: "chevy_silverado_ev", name: "Silverado EV" },
      { id: "chevy_equinox_ev", name: "Equinox EV" },
    ]
  },
  {
    manufacturer: "Ford",
    models: [
      { id: "ford_mach_e", name: "Mustang Mach-E" },
      { id: "ford_f150_lightning", name: "F-150 Lightning" },
      { id: "ford_e_transit", name: "E-Transit" },
    ]
  },
  {
    manufacturer: "Hyundai",
    models: [
      { id: "hyundai_ioniq5", name: "IONIQ 5" },
      { id: "hyundai_ioniq6", name: "IONIQ 6" },
      { id: "hyundai_kona_ev", name: "Kona Electric" },
    ]
  },
  {
    manufacturer: "Kia",
    models: [
      { id: "kia_ev6", name: "EV6" },
      { id: "kia_niro_ev", name: "Niro EV" },
      { id: "kia_ev9", name: "EV9" },
    ]
  },
  {
    manufacturer: "Volkswagen",
    models: [
      { id: "vw_id4", name: "ID.4" },
      { id: "vw_id_buzz", name: "ID. Buzz" },
    ]
  },
  {
    manufacturer: "Nissan",
    models: [
      { id: "nissan_leaf", name: "Leaf" },
      { id: "nissan_ariya", name: "Ariya" },
    ]
  },
  {
    manufacturer: "BMW",
    models: [
      { id: "bmw_i4", name: "i4" },
      { id: "bmw_i7", name: "i7" },
      { id: "bmw_ix", name: "iX" },
      { id: "bmw_i5", name: "i5" },
    ]
  },
  {
    manufacturer: "Audi",
    models: [
      { id: "audi_etron", name: "e-tron" },
      { id: "audi_etron_gt", name: "e-tron GT" },
      { id: "audi_q4_etron", name: "Q4 e-tron" },
      { id: "audi_q8_etron", name: "Q8 e-tron" },
    ]
  },
  {
    manufacturer: "Mercedes-Benz",
    models: [
      { id: "mercedes_eqs", name: "EQS" },
      { id: "mercedes_eqe", name: "EQE" },
      { id: "mercedes_eqb", name: "EQB" },
      { id: "mercedes_eqa", name: "EQA" },
    ]
  },
  {
    manufacturer: "Lucid",
    models: [
      { id: "lucid_air", name: "Air" },
    ]
  },
  {
    manufacturer: "Rivian",
    models: [
      { id: "rivian_r1t", name: "R1T" },
      { id: "rivian_r1s", name: "R1S" },
    ]
  },
  {
    manufacturer: "Polestar",
    models: [
      { id: "polestar_2", name: "Polestar 2" },
      { id: "polestar_3", name: "Polestar 3" },
    ]
  },
  {
    manufacturer: "Volvo",
    models: [
      { id: "volvo_c40", name: "C40 Recharge" },
      { id: "volvo_xc40", name: "XC40 Recharge" },
      { id: "volvo_ex30", name: "EX30" },
      { id: "volvo_ex90", name: "EX90" },
    ]
  },
  {
    manufacturer: "Other Options",
    models: [
      { id: "custom", name: "Custom Range..." },
    ]
  }
];

export function VehicleSelector() {
  const [isClient, setIsClient] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Show/hide custom range field when "Custom Range" is selected
    const vehicleSelect = document.getElementById('vehicle') as HTMLSelectElement;
    const customRangeSection = document.getElementById('customRangeSection');
    
    if (vehicleSelect && customRangeSection) {
      vehicleSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
          customRangeSection.classList.remove('hidden');
          setShowCustomRange(true);
        } else {
          customRangeSection.classList.add('hidden');
          setShowCustomRange(false);
        }
      });
    }
  }, []);

  // Only render the loading placeholder during SSR
  if (!isClient) {
    return (
      <div className="animate-pulse">
        <div className="h-5 bg-muted rounded w-1/3 mb-1"></div>
        <div className="h-10 bg-muted rounded w-full"></div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="vehicle" className="block text-sm font-medium mb-1">
        Vehicle Model
      </label>
      <select
        id="vehicle"
        className="w-full px-3 py-2 border rounded-md text-sm"
      >
        <option value="">Select your vehicle</option>
        {vehicleOptions.map((category) => (
          <optgroup key={category.manufacturer} label={category.manufacturer}>
            {category.models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      
      <div id="customRangeSection" className={showCustomRange ? "" : "hidden"}>
        <div className="mt-4">
          <label htmlFor="customRange" className="block text-sm font-medium mb-1">
            Custom Range (miles)
          </label>
          <input
            type="number"
            id="customRange"
            placeholder="Enter range in miles"
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
}