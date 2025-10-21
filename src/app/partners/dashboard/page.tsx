'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  Users,
  QrCode,
  Plus,
  Edit,
  Trash,
  Eye,
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  current_redemptions: number;
  max_redemptions: number;
  status: string;
  valid_until: string;
  redemption_rate: number;
  is_expired: boolean;
}

interface PartnerStats {
  total_revenue: number;
  total_redemptions: number;
  active_deals: number;
  conversion_rate: number;
}

export default function PartnerDashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<PartnerStats>({
    total_revenue: 0,
    total_redemptions: 0,
    active_deals: 0,
    conversion_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Get partner ID from session (implement your auth logic)
  const partnerId = 'get-from-session'; // TODO: Replace with actual session

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // Load deals
      const dealsResponse = await fetch(`/api/partners/deals?partner_id=${partnerId}`);
      const dealsData = await dealsResponse.json();
      setDeals(dealsData.deals || []);

      // Calculate stats
      const activeDeals = dealsData.deals?.filter((d: Deal) => d.status === 'active') || [];
      const totalRedemptions = dealsData.deals?.reduce(
        (sum: number, d: Deal) => sum + d.current_redemptions,
        0
      ) || 0;

      setStats({
        total_revenue: totalRedemptions * 15, // Estimate $15 average per redemption
        total_redemptions: totalRedemptions,
        active_deals: activeDeals.length,
        conversion_rate: totalRedemptions > 0 ? (totalRedemptions / 1000) * 100 : 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createDeal() {
    // TODO: Implement deal creation modal
    window.location.href = '/partners/deals/new';
  }

  async function deleteDeal(dealId: string) {
    if (!confirm('Are you sure you want to deactivate this deal?')) return;

    try {
      await fetch(`/api/partners/deals?deal_id=${dealId}&partner_id=${partnerId}`, {
        method: 'DELETE',
      });
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your deals and track performance</p>
        </div>
        <Button onClick={createDeal} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Deal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.total_revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_redemptions}</div>
            <p className="text-xs text-muted-foreground">
              Across all active deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_deals}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              From views to redemptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deals Management */}
      <Card>
        <CardHeader>
          <CardTitle>Your Deals</CardTitle>
          <CardDescription>Manage and track your promotional deals</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {deals.filter(d => d.status === 'active' && !d.is_expired).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active deals. Create your first deal to get started!
                </div>
              ) : (
                deals
                  .filter(d => d.status === 'active' && !d.is_expired)
                  .map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onDelete={() => deleteDeal(deal.id)}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="paused" className="space-y-4">
              {deals.filter(d => d.status === 'paused').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No paused deals.
                </div>
              ) : (
                deals
                  .filter(d => d.status === 'paused')
                  .map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onDelete={() => deleteDeal(deal.id)}
                    />
                  ))
              )}
            </TabsContent>

            <TabsContent value="expired" className="space-y-4">
              {deals.filter(d => d.is_expired || d.status === 'inactive').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No expired deals.
                </div>
              ) : (
                deals
                  .filter(d => d.is_expired || d.status === 'inactive')
                  .map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onDelete={() => deleteDeal(deal.id)}
                    />
                  ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function DealCard({ deal, onDelete }: { deal: Deal; onDelete: () => void }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{deal.title}</h3>
              <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                {deal.status}
              </Badge>
              {deal.is_expired && <Badge variant="destructive">Expired</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{deal.description}</p>
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-medium">Redemptions:</span>{' '}
                {deal.current_redemptions}
                {deal.max_redemptions && ` / ${deal.max_redemptions}`}
              </div>
              <div>
                <span className="font-medium">Rate:</span> {deal.redemption_rate.toFixed(1)}%
              </div>
              {deal.valid_until && (
                <div>
                  <span className="font-medium">Expires:</span>{' '}
                  {new Date(deal.valid_until).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
