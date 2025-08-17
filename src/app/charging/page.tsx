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
  currentKw: number;
  energyDelivered: number;
  cost: number;
  estimatedTime: number;
  batteryLevel: number;
  targetLevel: number;
}

export default function ChargingPage() {
  const searchParams = useSearchParams();
  const stationId = searchParams.get('station') || 'tesla-van-aken';
  
  const [session, setSession] = useState<ChargingSession>({
    id: 'session-' + Date.now(),
    stationName: 'Tesla Supercharger - Van Aken',
    connectorType: 'CCS',
    startTime: new Date(),
    currentKw: 150,
    energyDelivered: 0,
    cost: 0,
    estimatedTime: 25,
    batteryLevel: 20,
    targetLevel: 80
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [showQrCode, setShowQrCode] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);

  // Simulate charging progress
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      setSession(prev => ({
        ...prev,
        energyDelivered: Math.min(prev.energyDelivered + 0.5, 50),
        cost: prev.cost + 0.14,
        batteryLevel: Math.min(prev.batteryLevel + 1, prev.targetLevel)
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const chargingProgress = ((session.batteryLevel - 20) / (session.targetLevel - 20)) * 100;

  const handleDealSelect = (deal: any) => {
    setSelectedDeal(deal);
    setShowQrCode(true);
  };

  const handleStopCharging = () => {
    // In production, this would call an API to stop charging
    alert('Charging session ended. Thank you for using Pluggist!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charging Status */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="w-5 h-5 text-green-500" />
                  Charging Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-500">
                    {session.batteryLevel}%
                  </div>
                  <Progress value={chargingProgress} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Target: {session.targetLevel}%
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Power</p>
                    <p className="font-semibold">{session.currentKw} kW</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Energy</p>
                    <p className="font-semibold">{session.energyDelivered.toFixed(1)} kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="font-semibold">${session.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="destructive"
                  onClick={handleStopCharging}
                >
                  Stop Charging
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Station Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">{session.stationName}</p>
                  <p className="text-sm text-muted-foreground">20121 Van Aken Blvd, Shaker Heights</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    <Wifi className="w-3 h-3 mr-1" />
                    Free WiFi
                  </Badge>
                  <Badge variant="outline">
                    <Coffee className="w-3 h-3 mr-1" />
                    Coffee Shop
                  </Badge>
                  <Badge variant="outline">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    Shopping
                  </Badge>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Station Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-sm text-muted-foreground">(423)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - ChargePal Chat */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">ChargePal AI Assistant</TabsTrigger>
                <TabsTrigger value="deals">Active Deals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-4">
                <ChargePalChat
                  stationId={stationId}
                  stationName={session.stationName}
                  estimatedChargingTime={session.estimatedTime}
                  onDealSelect={handleDealSelect}
                />
              </TabsContent>
              
              <TabsContent value="deals" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Exclusive Charging Deals</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Show these QR codes at participating businesses
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showQrCode && selectedDeal ? (
                      <div className="text-center space-y-4">
                        <div className="bg-white p-8 rounded-lg inline-block">
                          <QrCode className="w-48 h-48" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{selectedDeal.business}</p>
                          <p className="text-muted-foreground">{selectedDeal.offer}</p>
                          <Badge className="mt-2">Valid for {selectedDeal.validUntil}</Badge>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setShowQrCode(false)}
                        >
                          Back to Deals
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        <div 
                          className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleDealSelect({
                            business: 'Subway',
                            offer: 'BOGO Footlong',
                            validUntil: '2 hours'
                          })}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Subway</p>
                              <p className="text-sm text-muted-foreground">BOGO Footlong with any drink</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">0.2 mi</Badge>
                                <Badge variant="secondary">Valid 2 hours</Badge>
                              </div>
                            </div>
                            <Badge className="bg-green-500">Active</Badge>
                          </div>
                        </div>
                        
                        <div 
                          className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleDealSelect({
                            business: 'Starbucks',
                            offer: '20% off any drink',
                            validUntil: '1 hour'
                          })}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Starbucks</p>
                              <p className="text-sm text-muted-foreground">20% off any drink</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">0.1 mi</Badge>
                                <Badge variant="secondary">Valid 1 hour</Badge>
                              </div>
                            </div>
                            <Badge className="bg-green-500">Active</Badge>
                          </div>
                        </div>
                        
                        <div 
                          className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleDealSelect({
                            business: 'Target',
                            offer: '$5 off $25 purchase',
                            validUntil: '3 hours'
                          })}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Target</p>
                              <p className="text-sm text-muted-foreground">$5 off $25+ purchase</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">0.3 mi</Badge>
                                <Badge variant="secondary">Valid 3 hours</Badge>
                              </div>
                            </div>
                            <Badge className="bg-green-500">Active</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
