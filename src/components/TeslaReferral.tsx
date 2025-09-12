'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Zap, DollarSign } from 'lucide-react';

export function TeslaReferral() {
  const handleTeslaClick = () => {
    // Track the referral click for revenue sharing
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'tesla_referral_click', {
        event_category: 'referral',
        event_label: 'tesla_purchase'
      });
    }
    
    // Tesla referral link - replace with actual referral code
    window.open('https://www.tesla.com/referral/your-referral-code', '_blank');
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-red-50 to-red-100 border-red-200">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-2">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-red-800">Ready for Your EV?</CardTitle>
        <CardDescription className="text-red-600">
          Join millions of Tesla owners. Support Pluggist when you buy!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <DollarSign className="w-5 h-5 mx-auto text-green-600 mb-1" />
            <p className="text-sm font-medium">$1,000</p>
            <p className="text-xs text-gray-600">Tesla Credit</p>
          </div>
          <div className="text-center">
            <Zap className="w-5 h-5 mx-auto text-blue-600 mb-1" />
            <p className="text-sm font-medium">Free</p>
            <p className="text-xs text-gray-600">Supercharging</p>
          </div>
        </div>

        <Button 
          onClick={handleTeslaClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          size="lg"
        >
          Shop Tesla
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>

        <p className="text-xs text-center text-gray-500">
          Using our link helps fund free charging station data for everyone
        </p>
      </CardContent>
    </Card>
  );
}

export default TeslaReferral;