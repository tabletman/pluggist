'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Zap, Users, MapPin, Star, TrendingUp, Wallet, Gift } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface UserEarnings {
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  station_report_earnings: number;
  installation_referral_earnings: number;
  affiliate_earnings: number;
  review_earnings: number;
  monthly_earnings: number;
}

interface UserStats {
  verified_stations: number;
  total_reports: number;
  total_referrals: number;
  pending_installation_leads: number;
  completed_installation_leads: number;
  points: number;
  level: string;
  earnings_tier: string;
}

export function UserEarningsDashboard() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<UserEarnings | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
  const [pendingLeads, setPendingLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserEarnings();
    }
  }, [user]);

  const loadUserEarnings = async () => {
    try {
      // Load user earnings
      const { data: earningsData } = await supabase
        .from('user_earnings')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      setEarnings(earningsData || {
        total_earnings: 0,
        pending_earnings: 0,
        paid_earnings: 0,
        station_report_earnings: 0,
        installation_referral_earnings: 0,
        affiliate_earnings: 0,
        review_earnings: 0,
        monthly_earnings: 0
      });

      // Load user stats
      const { data: statsData } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      setStats(statsData || {
        verified_stations: 0,
        total_reports: 0,
        total_referrals: 0,
        pending_installation_leads: 0,
        completed_installation_leads: 0,
        points: 0,
        level: 'Bronze',
        earnings_tier: 'bronze'
      });

      // Load recent payouts
      const { data: payoutsData } = await supabase
        .from('revenue_payouts')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentPayouts(payoutsData || []);

      // Load pending installation leads
      const { data: leadsData } = await supabase
        .from('installation_leads')
        .select('*')
        .eq('reported_by_user', user!.id)
        .in('status', ['new', 'contacted', 'quoted', 'scheduled'])
        .order('created_at', { ascending: false });

      setPendingLeads(leadsData || []);

    } catch (error) {
      console.error('Error loading user earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async () => {
    if (!earnings || earnings.pending_earnings < 10) {
      alert('Minimum payout amount is $10.00');
      return;
    }

    try {
      const { error } = await supabase
        .from('revenue_payouts')
        .insert({
          user_id: user!.id,
          amount: earnings.pending_earnings,
          status: 'pending'
        });

      if (error) throw error;

      alert('Payout requested! You\'ll receive payment within 5-7 business days.');
      loadUserEarnings(); // Refresh data
    } catch (error) {
      console.error('Error requesting payout:', error);
      alert('Error requesting payout. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading your earnings...</div>;
  }

  if (!earnings || !stats) {
    return <div className="p-8 text-center">Error loading earnings data.</div>;
  }

  const nextLevelPoints = {
    Bronze: 500,
    Silver: 2000,
    Gold: 5000,
    Platinum: 10000
  }[stats.level as keyof typeof nextLevelPoints] || 10000;

  const progressToNextLevel = Math.min((stats.points / nextLevelPoints) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Earnings Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your revenue from Pluggist contributions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={stats.level === 'Platinum' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
            {stats.level} Level
          </Badge>
          <Badge variant="outline">
            {stats.points} points
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${earnings.total_earnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">${earnings.pending_earnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Pending Payout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">${earnings.monthly_earnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completed_installation_leads}</p>
                <p className="text-sm text-gray-600">Installations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{stats.level} Level</span>
              <span>{stats.points} / {nextLevelPoints} points</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
            <p className="text-xs text-gray-600">
              Earn more points by reporting stations, getting installations completed, and referring users!
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="earnings">Earnings Breakdown</TabsTrigger>
          <TabsTrigger value="leads">Installation Leads</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="stats">Your Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Sources</CardTitle>
              <CardDescription>How you're earning money on Pluggist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span>Installation Referrals</span>
                  </div>
                  <span className="font-medium">${earnings.installation_referral_earnings.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>Station Reports</span>
                  </div>
                  <span className="font-medium">${earnings.station_report_earnings.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>User Referrals</span>
                  </div>
                  <span className="font-medium">${earnings.affiliate_earnings.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Reviews</span>
                  </div>
                  <span className="font-medium">${earnings.review_earnings.toFixed(2)}</span>
                </div>
              </div>

              {earnings.pending_earnings >= 10 && (
                <div className="pt-4 border-t">
                  <Button onClick={requestPayout} className="w-full md:w-auto">
                    Request Payout - ${earnings.pending_earnings.toFixed(2)}
                  </Button>
                  <p className="text-xs text-gray-600 mt-2">
                    Payments processed via PayPal within 5-7 business days
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Installation Leads</CardTitle>
              <CardDescription>Track the status of businesses you've referred for charging installations</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLeads.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending installation leads</p>
              ) : (
                <div className="space-y-4">
                  {pendingLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{lead.business_name}</h4>
                        <p className="text-sm text-gray-600">{lead.address}</p>
                        <p className="text-xs text-gray-500">
                          Submitted {new Date(lead.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          lead.status === 'new' ? 'secondary' :
                          lead.status === 'contacted' ? 'default' :
                          lead.status === 'quoted' ? 'outline' : 'secondary'
                        }>
                          {lead.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          Est. ${((lead.estimated_commission || 300) * 0.25).toFixed(0)} when completed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Your payment history and pending payouts</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPayouts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No payouts yet</p>
              ) : (
                <div className="space-y-4">
                  {recentPayouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">${payout.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(payout.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">{payout.payout_method}</p>
                      </div>
                      <Badge variant={
                        payout.status === 'completed' ? 'default' :
                        payout.status === 'processing' ? 'secondary' :
                        payout.status === 'pending' ? 'outline' : 'destructive'
                      }>
                        {payout.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold">{stats.verified_stations}</p>
                <p className="text-sm text-gray-600">Verified Stations</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Zap className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold">{stats.completed_installation_leads}</p>
                <p className="text-sm text-gray-600">Completed Installs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold">{stats.total_referrals}</p>
                <p className="text-sm text-gray-600">User Referrals</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserEarningsDashboard;