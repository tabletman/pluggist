'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, DollarSign, Phone } from 'lucide-react';
import Link from 'next/link';

interface InstallationCTAProps {
  businessName?: string;
  location?: string;
  compact?: boolean;
}

export function InstallationCTA({ businessName, location, compact = false }: InstallationCTAProps) {
  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Need charging here?</p>
              <p className="text-xs text-gray-600">Earn $25-75 per installation</p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/suggest-installation">
              Suggest
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-blue-800">
          {businessName ? `Help ${businessName} Get Charging` : 'Know a Business That Needs Charging?'}
        </CardTitle>
        <CardDescription className="text-blue-600">
          Earn money when they install through our electrician partners
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <DollarSign className="w-5 h-5 mx-auto text-green-600 mb-1" />
            <p className="text-sm font-medium">$25-75</p>
            <p className="text-xs text-gray-600">Your Share</p>
          </div>
          <div>
            <Phone className="w-5 h-5 mx-auto text-blue-600 mb-1" />
            <p className="text-sm font-medium">Free</p>
            <p className="text-xs text-gray-600">Consultation</p>
          </div>
          <div>
            <Zap className="w-5 h-5 mx-auto text-purple-600 mb-1" />
            <p className="text-sm font-medium">Licensed</p>
            <p className="text-xs text-gray-600">Electricians</p>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-800 mb-1">Our Electrician Partners:</h4>
          <ul className="text-sm text-blue-700">
            <li>• Skettle Electric</li>
            <li>• Independent Guild of Electricians</li>
            <li>• Licensed professionals nationwide</li>
          </ul>
        </div>

        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          <Link href={`/suggest-installation${businessName ? `?business=${encodeURIComponent(businessName)}&location=${encodeURIComponent(location || '')}` : ''}`}>
            Submit Installation Lead
          </Link>
        </Button>

        <p className="text-xs text-center text-gray-600">
          Free consultation • You get paid when they install • No obligation
        </p>
      </CardContent>
    </Card>
  );
}

export default InstallationCTA;