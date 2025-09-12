'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChargePalChat } from '@/components/chargepal-chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Battery, 
  Clock, 
  DollarSign, 
  MapPin, 
  Wifi, 
  Coffee, 
  ShoppingBag,
  Zap,
  QrCode,
  Star
} from 'lucide-react';

interface ChargingSession {
  id: string;
  stationName: string;
  connectorType: string;
  startTime: Date;
  currentCharge: number;
  targetCharge: number;
  chargingSpeed: number;
  estimatedTime: number;
  energyDelivered: number;
  cost: number;
}

export function ChargingContent() {
  const searchParams = useSearchParams();
  const stationId = searchParams.get('station');
  
  // Mock charging session data
  const [session, setSession] = useState<ChargingSession>({
    id: 'session-1',
    stationName: 'Whole Foods Market - Downtown',
    connectorType: 'CCS',
    startTime: new Date(),
    currentCharge: 45,
    targetCharge: 80,
    chargingSpeed: 150,
    estimatedTime: 25,
    energyDelivered: 12.5,
    cost: 4.75
  });

  // Simulate charging progress
  useEffect(() => {
    const interval = setInterval(() => {
      setSession(prev => ({
        ...prev,
        currentCharge: Math.min(prev.currentCharge + 0.5, prev.targetCharge),
        energyDelivered: prev.energyDelivered + 0.2,
        cost: prev.cost + 0.08
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Charging Session Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Session Card */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      Charging in Progress
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{session.stationName}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100">
                    {session.connectorType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Charging Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Battery Level</span>
                    <span className="font-semibold">{session.currentCharge.toFixed(0)}%</span>
                  </div>
                  <Progress value={session.currentCharge} className="h-3" />
                  <p className="text-xs text-gray-500">
                    Target: {session.targetCharge}% • {session.estimatedTime} min remaining
                  </p>
                </div>

                {/* Session Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {session.chargingSpeed}
                    </p>
                    <p className="text-xs text-gray-600">kW</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {session.energyDelivered.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600">kWh</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      ${session.cost.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Clock className="h-4 w-4 mr-2" />
                    Extend Time
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    Stop Charging
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Deals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-purple-600" />
                  Exclusive Deals While You Charge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {[
                    {
                      name: "Starbucks",
                      deal: "20% off any drink",
                      distance: "50m",
                      icon: Coffee,
                      expiry: "30 min"
                    },
                    {
                      name: "Whole Foods",
                      deal: "$5 off $25+ purchase",
                      distance: "100m",
                      icon: ShoppingBag,
                      expiry: "2 hours"
                    },
                    {
                      name: "AMC Theater",
                      deal: "Buy 1 Get 1 Movie Ticket",
                      distance: "200m",
                      icon: Star,
                      expiry: "Today only"
                    }
                  ].map((deal, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <deal.icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{deal.name}</p>
                          <p className="text-sm text-gray-600">{deal.deal}</p>
                          <div className="flex gap-3 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {deal.distance}
                            </span>
                            <span className="text-xs text-orange-600">
                              Expires in {deal.expiry}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <QrCode className="h-4 w-4 mr-1" />
                        Get Code
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ChargePal Chat Sidebar */}
          <div className="lg:col-span-1">
            <ChargePalChat 
              stationId={stationId || 'default'}
              context={{
                chargingProgress: session.currentCharge,
                estimatedTime: session.estimatedTime,
                location: session.stationName
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}