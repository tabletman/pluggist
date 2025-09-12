'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, DollarSign, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface InstallationReferralProps {
  businessName?: string;
  businessAddress?: string;
  onSubmit?: (leadId: string) => void;
}

export function InstallationReferral({ businessName, businessAddress, onSubmit }: InstallationReferralProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    business_name: businessName || '',
    address: businessAddress || '',
    contact_person: '',
    phone: '',
    email: '',
    estimated_daily_traffic: '',
    property_type: 'retail' as const,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('installation_leads')
        .insert({
          ...formData,
          estimated_daily_traffic: parseInt(formData.estimated_daily_traffic) || 0,
          reported_by_user: user.id,
          status: 'new'
        })
        .select()
        .single();

      if (error) throw error;

      // Reward the user with points
      await supabase
        .from('user_rewards')
        .upsert({
          user_id: user.id,
          points: supabase.raw('points + 200'),
          pending_installation_leads: supabase.raw('pending_installation_leads + 1')
        });

      setSubmitted(true);
      onSubmit?.(data.id);
    } catch (error) {
      console.error('Error submitting installation lead:', error);
      alert('Error submitting lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Lead Submitted!</CardTitle>
          <CardDescription>
            Thanks for the referral! You've earned 200 points and could earn up to $75 when this installation is completed.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Suggest EV Charging Installation
        </CardTitle>
        <CardDescription>
          Know a business that needs EV charging? Submit a lead and earn money when they install!
        </CardDescription>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <DollarSign className="w-6 h-6 mx-auto text-green-600 mb-1" />
            <p className="text-sm font-medium">$25-75</p>
            <p className="text-xs text-gray-600">Per Installation</p>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto text-blue-600 mb-1" />
            <p className="text-sm font-medium">25%</p>
            <p className="text-xs text-gray-600">Commission Share</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-6 h-6 mx-auto text-purple-600 mb-1" />
            <p className="text-sm font-medium">200</p>
            <p className="text-xs text-gray-600">Bonus Points</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Alert className="mb-6">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            We partner with licensed electricians including Skettle Electric and the Independent Guild of Electricians to provide professional installations.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="property_type">Property Type *</Label>
              <Select value={formData.property_type} onValueChange={(value: any) => setFormData({...formData, property_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail Store</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="hotel">Hotel/Lodging</SelectItem>
                  <SelectItem value="office">Office Building</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Contact Person *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="estimated_daily_traffic">Estimated Daily Visitors</Label>
              <Input
                id="estimated_daily_traffic"
                type="number"
                value={formData.estimated_daily_traffic}
                onChange={(e) => setFormData({...formData, estimated_daily_traffic: e.target.value})}
                placeholder="e.g. 200"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional information about parking, power availability, etc."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Installation Lead'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">What happens next?</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. We'll contact the business within 24 hours</li>
            <li>2. Our electrician partners provide a free consultation</li>
            <li>3. If they install, you earn 25% of our referral commission</li>
            <li>4. Payment processed within 30 days of installation</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstallationReferral;