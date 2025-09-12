import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Battery, Users, Target, Award, MapPin, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Powering the Future of Electric Mobility
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                PLUGGIST is the comprehensive EV charging directory that connects drivers with reliable charging infrastructure, 
                enabling seamless electric vehicle adoption across America.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe electric vehicles are the future of transportation. Our mission is to eliminate 
                  range anxiety and accelerate EV adoption by providing the most comprehensive, accurate, and 
                  user-friendly charging station directory.
                </p>
                <p className="text-lg text-muted-foreground">
                  From emergency charging situations to planned road trips, PLUGGIST ensures EV drivers never 
                  get stranded and always find the perfect charging solution for their needs.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center p-6">
                  <Battery className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary">50K+</h3>
                  <p className="text-sm text-muted-foreground">Charging Stations</p>
                </Card>
                <Card className="text-center p-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary">100K+</h3>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </Card>
                <Card className="text-center p-6">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary">All 50</h3>
                  <p className="text-sm text-muted-foreground">US States</p>
                </Card>
                <Card className="text-center p-6">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary">24/7</h3>
                  <p className="text-sm text-muted-foreground">Real-time Data</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything we do is guided by our commitment to reliability, accessibility, and innovation.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Accuracy First</h3>
                <p className="text-muted-foreground">
                  We provide real-time, verified charging station data so you can trust every recommendation.
                </p>
              </Card>
              <Card className="text-center p-6">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Community Driven</h3>
                <p className="text-muted-foreground">
                  Our platform thrives on user contributions, reviews, and shared experiences from the EV community.
                </p>
              </Card>
              <Card className="text-center p-6">
                <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously improve our technology to deliver the best EV charging experience possible.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">The PLUGGIST Story</h2>
              <div className="prose prose-lg mx-auto">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  PLUGGIST was born from a simple frustration: finding reliable EV charging stations shouldn't be hard. 
                  As early EV adopters, our founders experienced the anxiety of not knowing where to charge, whether 
                  stations were working, or if they'd be compatible with their vehicle.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  What started as a side project to map charging stations in our local area has grown into a 
                  comprehensive platform serving hundreds of thousands of EV drivers nationwide. We've partnered 
                  with charging networks, integrated real-time availability data, and built tools that make EV 
                  ownership seamless and stress-free.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, PLUGGIST is more than just a directory – we're a complete ecosystem for EV drivers, 
                  offering trip planning, installation referrals, exclusive deals, and the most advanced AI-powered 
                  charging assistant in the industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
              <p className="text-lg text-muted-foreground">
                Meet the team driving the electric revolution forward.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sarah Chen</h3>
                <p className="text-muted-foreground mb-3">CEO & Co-Founder</p>
                <p className="text-sm text-muted-foreground">
                  Former Tesla engineer with 10+ years in EV technology and sustainable transportation.
                </p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Marcus Rodriguez</h3>
                <p className="text-muted-foreground mb-3">CTO & Co-Founder</p>
                <p className="text-sm text-muted-foreground">
                  Software architect specializing in mapping technologies and real-time data systems.
                </p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Jessica Park</h3>
                <p className="text-muted-foreground mb-3">VP of Partnerships</p>
                <p className="text-sm text-muted-foreground">
                  Industry veteran connecting charging networks, automakers, and infrastructure providers.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Electric Revolution</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Whether you're a new EV owner or a seasoned electric driver, PLUGGIST is here to power your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/search?location=current" 
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                🚨 Find Chargers Now
              </a>
              <a 
                href="/signup" 
                className="inline-flex items-center justify-center px-8 py-3 border border-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Join Our Community
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}