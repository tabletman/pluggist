'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Verify the session and get details
      fetch(`/api/verify-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSession(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error verifying session:', error);
          setLoading(false);
        });

      // Track successful subscription
      if (typeof window !== 'undefined') {
        window.gtag?.('event', 'purchase', {
          transaction_id: sessionId,
          currency: 'USD',
          value: session?.amount_total ? session.amount_total / 100 : 9.99
        });
      }
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Welcome to Premium!</CardTitle>
          <CardDescription>
            Your subscription is now active. Start earning money with Pluggist!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Crown className="w-6 h-6 mx-auto text-blue-600 mb-1" />
              <p className="text-sm font-medium">Premium Features</p>
              <p className="text-xs text-gray-600">Unlocked</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-6 h-6 mx-auto text-green-600 mb-1" />
              <p className="text-sm font-medium">Revenue Sharing</p>
              <p className="text-xs text-gray-600">Active</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">🚀 Start Earning Now!</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Refer Tesla purchases: $1,000 each</li>
              <li>• Submit installation leads: $25-75 each</li>
              <li>• Share in advertising revenue: 30%</li>
              <li>• Refer new users: $25 each</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard/earnings">
                View Earnings Dashboard
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/search">
                Start Finding Stations
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Questions? Email us at support@pluggist.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}