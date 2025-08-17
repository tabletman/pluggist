'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, Users, DollarSign, Zap, Store, QrCode, BarChart } from 'lucide-react';

export default function ForBusinessPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    location: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your interest! We\'ll contact you within 24 hours.');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                Partner Program Now Open
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Reach 50+ Premium Customers Daily While They Charge
              </h1>
              <p className="text-xl mb-8 text-white/90">
                EV drivers spend 15-45 minutes at charging stations. Turn their wait time into your opportunity with exclusive deals delivered by our AI assistant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">$150k+</div>
                <p className="text-sm text-muted-foreground">Avg. EV Owner Income</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">30 min</div>
                <p className="text-sm text-muted-foreground">Avg. Charging Time</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">35%</div>
                <p className="text-sm text-muted-foreground">Deal Redemption Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.8/5</div>
                <p className="text-sm text-muted-foreground">Partner Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How Pluggist Works for Your Business</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>1. Driver Starts Charging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    When an EV driver plugs in at a nearby station, our ChargePal AI activates and engages them in conversation.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>2. AI Presents Your Deal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Based on the driver's preferences and your targeting, ChargePal presents your exclusive offer with a QR code.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>3. Customer Visits & Redeems</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Driver walks to your business, shows the QR code, and redeems the deal. You track everything in real-time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Start with a free trial. Pay only for results. No setup fees, no hidden costs.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <div className="text-3xl font-bold">$299<span className="text-base font-normal">/month</span></div>
                  <CardDescription>Perfect for single locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Up to 100 deals/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Basic analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>QR code redemption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Email support</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6">Start Free Trial</Button>
                </CardContent>
              </Card>
              
              <Card className="border-primary">
                <CardHeader>
                  <Badge className="mb-2">Most Popular</Badge>
                  <CardTitle>Growth</CardTitle>
                  <div className="text-3xl font-bold">$599<span className="text-base font-normal">/month</span></div>
                  <CardDescription>For growing businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Unlimited deals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>A/B testing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Custom targeting</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6">Start Free Trial</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <div className="text-3xl font-bold">Custom</div>
                  <CardDescription>For chains & franchises</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Multiple locations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>API access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>SLA guarantee</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6" variant="outline">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg italic mb-4">
                    "We've seen a 25% increase in lunch traffic since partnering with Pluggist. The EV drivers are exactly our target demographic - professionals who appreciate quality."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div>
                      <p className="font-semibold">Sarah Chen</p>
                      <p className="text-sm text-muted-foreground">Owner, Fusion Bistro</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg italic mb-4">
                    "The ROI is incredible. We're spending $599/month and generating over $8,000 in additional revenue from Pluggist customers."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div>
                      <p className="font-semibold">Mike Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Manager, Quick Mart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Start Your Free Trial</CardTitle>
                  <CardDescription>
                    No credit card required. Get set up in 5 minutes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select 
                          value={formData.businessType} 
                          onValueChange={(value) => setFormData({...formData, businessType: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="restaurant">Restaurant</SelectItem>
                            <SelectItem value="retail">Retail Store</SelectItem>
                            <SelectItem value="grocery">Grocery</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="service">Service Business</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="location">Location/City</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="e.g., Cleveland, OH"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your business and goals..."
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" size="lg">
                      Start Free Trial
                    </Button>
                    
                    <p className="text-sm text-center text-muted-foreground">
                      By submitting, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
