'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Battery, 
  Zap, 
  MapPin, 
  Clock, 
  DollarSign, 
  Car,
  Cable,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface P2PChargingRequest {
  id: string;
  requesterLocation: { lat: number; lng: number };
  batteryLevel: number;
  vehicleModel: string;
  urgencyLevel: 'critical' | 'urgent' | 'normal';
  maxPrice: number;
  estimatedTime: number;
  message?: string;
}

interface P2PChargingHost {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  distance: number; // in miles
  availableNow: boolean;
  pricePerMinute: number;
  rating: number;
  totalSessions: number;
  chargerType: string;
  maxPower: number; // kW
}

const mockHosts: P2PChargingHost[] = [
  {
    id: 'host_1',
    name: 'Mike\'s Tesla Wall Connector',
    location: { lat: 41.5012, lng: -81.6891 },
    distance: 0.8,
    availableNow: true,
    pricePerMinute: 1.00, // $20 for 20 minutes
    rating: 4.9,
    totalSessions: 47,
    chargerType: 'Tesla Wall Connector',
    maxPower: 11.5
  },
  {
    id: 'host_2', 
    name: 'Sarah\'s ChargePoint Home',
    location: { lat: 41.4887, lng: -81.7094 },
    distance: 1.2,
    availableNow: true,
    pricePerMinute: 0.85, // $17 for 20 minutes
    rating: 4.7,
    totalSessions: 23,
    chargerType: 'ChargePoint Home Flex',
    maxPower: 9.6
  }
];

export function P2PEmergencyCharging() {
  const [showRequests, setShowRequests] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(8);
  const [maxPrice, setMaxPrice] = useState(25);

  const urgencyColor = batteryLevel <= 5 ? 'red' : batteryLevel <= 15 ? 'orange' : 'green';
  const urgencyText = batteryLevel <= 5 ? 'CRITICAL' : batteryLevel <= 15 ? 'URGENT' : 'NORMAL';

  return (
    <div className="space-y-6">
      {/* Emergency Request Card */}
      <Card className={`border-${urgencyColor}-200 bg-${urgencyColor}-50/50`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 text-${urgencyColor}-600`} />
                Emergency P2P Charging Request
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Find nearby EV owners willing to share their home charger
              </p>
            </div>
            <Badge 
              variant="outline" 
              className={`bg-${urgencyColor}-100 text-${urgencyColor}-800 border-${urgencyColor}-300`}
            >
              {urgencyText}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Current Battery Level</label>
              <div className="flex items-center gap-2 mt-1">
                <Battery className={`h-4 w-4 text-${urgencyColor}-600`} />
                <Input 
                  type="number" 
                  value={batteryLevel}
                  onChange={(e) => setBatteryLevel(parseInt(e.target.value))}
                  className="w-20"
                  min="0"
                  max="100"
                />
                <span className="text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Max Price (20 min)</label>
              <div className="flex items-center gap-2 mt-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <Input 
                  type="number" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-20"
                  min="10"
                  max="50"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Cable className="h-4 w-4" />
              How P2P Emergency Charging Works
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Request sent to nearby verified hosts within 2 miles</li>
              <li>• 20-minute rapid charge gets you 40-60 miles of range</li>
              <li>• Payment processed automatically through app</li>
              <li>• Host earns 70%, PLUGGIST takes 30% commission</li>
              <li>• Insurance coverage and safety verification included</li>
            </ul>
          </div>

          <Button 
            className={`w-full bg-${urgencyColor}-600 hover:bg-${urgencyColor}-700 text-white font-bold py-3`}
            size="lg"
          >
            <Zap className="h-5 w-5 mr-2" />
            Send Emergency P2P Request
          </Button>
        </CardContent>
      </Card>

      {/* Available Hosts */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Nearby P2P Hosts Available Now
        </h3>
        
        <div className="space-y-3">
          {mockHosts.map((host) => (
            <Card key={host.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{host.name}</h4>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Available Now
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-xs ${i < Math.floor(host.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({host.totalSessions} sessions)
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{host.distance} miles away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span>{host.maxPower} kW • {host.chargerType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span>~3 min drive time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-600" />
                        <span>${(host.pricePerMinute * 20).toFixed(0)} for 20 min</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 inline mr-1" />
                      Verified host • Insurance covered • Secure payment
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Request Charge
                    </Button>
                    <Button size="sm" variant="outline">
                      Call Host
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Car-to-Car Charging (Future Feature) */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-purple-600" />
            Car-to-Car Emergency Charging
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Revolutionary mobile-to-mobile charging for true emergencies. Like naval ship refueling at sea.
          </p>
          <div className="bg-purple-100 p-3 rounded-lg">
            <h5 className="font-semibold text-purple-800 mb-2">How It Will Work:</h5>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Direct DC cable connection between two EVs</li>
              <li>• Transfer 20-30 miles of range in 10-15 minutes</li>
              <li>• Emergency premium pricing: $30-50 per session</li>
              <li>• Mutual aid network for stranded EV drivers</li>
              <li>• Safety protocols and certified equipment required</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}