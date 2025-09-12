'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Users } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Basic charging station finder',
    features: [
      'Find charging stations',
      'Basic station info',
      'Community reviews',
      'Mobile-friendly web app'
    ],
    limitations: [
      'Limited to 10 searches per day',
      'No real-time availability',
      'No route planning'
    ],
    cta: 'Current Plan',
    popular: false,
    icon: Zap
  },
  {
    name: 'Premium',
    price: 9.99,
    period: 'month',
    description: 'Everything you need for EV road trips',
    features: [
      'Unlimited searches',
      'Real-time availability alerts',
      'Advanced route planning',
      'Multi-stop trip planning',
      'Charging cost calculator',
      'Save favorite stations',
      'Priority customer support',
      'Revenue sharing eligible'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true,
    icon: Crown
  },
  {
    name: 'Business',
    price: 29.99,
    period: 'month',
    description: 'For businesses and fleet managers',
    features: [
      'All Premium features',
      'Fleet management tools',
      'Usage analytics',
      'API access',
      'White-label options',
      'Dedicated account manager',
      'Custom integrations',
      'Priority installation referrals'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
    icon: Users
  }
];

export function PremiumSubscription() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (planName: string, price: number) => {
    setIsProcessing(true);
    
    try {
      // Track subscription attempt
      if (typeof window !== 'undefined') {
        window.gtag?.('event', 'subscription_attempt', {
          event_category: 'subscription',
          event_label: planName,
          value: price
        });
      }

      // In production, this would redirect to Stripe Checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planName,
          price: price * 100, // Convert to cents
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        // Fallback for development
        alert(`${planName} subscription would be $${price}/month. Stripe integration pending!`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription system coming soon! Thanks for your interest.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 text-lg">
          Start making money with Pluggist! Premium users earn revenue sharing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-lg scale-105' 
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.name === 'Premium' && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">💰 Revenue Sharing</p>
                    <p className="text-xs text-green-700 mt-1">
                      Earn money when you refer installations, users, or contribute data!
                    </p>
                  </div>
                )}

                <Button
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : plan.name === 'Free'
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                  onClick={() => plan.price > 0 && handleSubscribe(plan.name.toLowerCase(), plan.price)}
                  disabled={plan.name === 'Free' || isProcessing}
                >
                  {isProcessing ? 'Processing...' : plan.cta}
                </Button>

                {plan.name === 'Premium' && (
                  <p className="text-xs text-center text-gray-500">
                    7-day free trial • Cancel anytime
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4">Why Go Premium?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium">Save Time</h4>
            <p className="text-sm text-gray-600">
              Real-time data and route planning save hours on road trips
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium">Never Get Stranded</h4>
            <p className="text-sm text-gray-600">
              Live availability prevents showing up to broken chargers
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium">Earn Money</h4>
            <p className="text-sm text-gray-600">
              Premium users get paid for referrals and contributions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumSubscription;