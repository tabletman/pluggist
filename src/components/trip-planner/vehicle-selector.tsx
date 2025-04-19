"use client";

import { useState, useEffect } from "react";

export interface VehicleData {
  modelId: string;
  modelName: string;
  customRange: number | null;
}

interface VehicleSelectorProps {
  onChange: (vehicle: VehicleData) => void;
}

// Static data mapping vehicle IDs to ranges in miles
export const vehicleRanges: Record<string, number> = {
  tesla_model_3: 272,
  tesla_model_y: 330,
  tesla_model_s: 405,
  tesla_model_x: 348,
  tesla_cybertruck: 340,
  chevy_bolt_ev: 259,
  chevy_bolt_euv: 247,
  chevy_blazer_ev: 320,
  chevy_silverado_ev: 400,
  chevy_equinox_ev: 300,
  ford_mach_e: 314,
  ford_f150_lightning: 320,
  ford_e_transit: 126,
  hyundai_ioniq5: 303,
  hyundai_ioniq6: 361,
  hyundai_kona_ev: 258,
  kia_ev6: 310,
  kia_niro_ev: 253,
  kia_ev9: 304,
  vw_id4: 275,
  vw_id_buzz: 260,
  nissan_leaf: 212,
  nissan_ariya: 304,
  bmw_i4: 301,
  bmw_i7: 318,
  bmw_ix: 324,
  bmw_i5: 295,
  audi_etron: 222,
  audi_etron_gt: 238,
  audi_q4_etron: 241,
  audi_q8_etron: 285,
  mercedes_eqs: 350,
  mercedes_eqe: 305,
  mercedes_eqb: 243,
  mercedes_eqa: 250,
  lucid_air: 516,
  rivian_r1t: 328,
  rivian_r1s: 316,
  polestar_2: 270,
  polestar_3: 300,
  volvo_c40: 226,
  volvo_xc40: 223,
  volvo_ex30: 275,
  volvo_ex90: 300,
};

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

export function VehicleSelector({ onChange }: VehicleSelectorProps) {
  const [isClient, setIsClient] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleData>({
    modelId: "",
    modelName: "",
    customRange: null
  });
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    let modelName = "";
    
    // Find the model name from the selected option
    if (modelId) {
      for (const category of vehicleOptions) {
        const foundModel = category.models.find(model => model.id === modelId);
        if (foundModel) {
          modelName = `${category.manufacturer} ${foundModel.name}`;
          break;
        }
      }
    }
    
    const showCustom = modelId === 'custom';
    setShowCustomRange(showCustom);
    
    const newVehicle = {
      modelId,
      modelName,
      customRange: null
    };
    
    setVehicle(newVehicle);
    onChange(newVehicle);
  };
  
  const handleCustomRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customRange = e.target.value ? parseInt(e.target.value, 10) : null;
    const newVehicle = { ...vehicle, customRange };
    setVehicle(newVehicle);
    onChange(newVehicle);
  };

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
        value={vehicle.modelId}
        onChange={handleVehicleChange}
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
      
      {showCustomRange && (
        <div id="customRangeSection" className="mt-4">
          <label htmlFor="customRange" className="block text-sm font-medium mb-1">
            Custom Range (miles)
          </label>
          <input
            type="number"
            id="customRange"
            placeholder="Enter range in miles"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={vehicle.customRange || ""}
            onChange={handleCustomRangeChange}
          />
        </div>
      )}
    </div>
  );
}