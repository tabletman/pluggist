'use client';

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { HomeMapWrapper } from "@/components/ui/map-wrapper";
import { trackEmergencySearch, trackEvent } from "@/lib/analytics";
import Script from "next/script";

export default function HomePage() {
  const handleEmergencyClick = () => {
    // Get actual user location for tracking
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          trackEmergencySearch({ 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          });
        },
        () => {
          trackEmergencySearch(); // Track even if location fails
        }
      );
    }
    trackEvent('emergency_button_click', {
      page_location: window.location.href,
      button_text: 'FIND CHARGING NEAR ME NOW'
    });
  };

  return (
    <>
      {/* Enhanced Schema Markup for Homepage */}
      <Script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "PLUGGIST",
            "description": "Emergency EV charging station finder with real-time availability",
            "url": "https://pluggist.com",
            "logo": "https://pluggist.com/logo.png",
            "sameAs": [
              "https://twitter.com/pluggist",
              "https://facebook.com/pluggist"
            ],
            "serviceArea": {
              "@type": "Country",
              "name": "United States"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "EV Charging Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Emergency EV Charging Locator",
                    "description": "Find nearest charging stations instantly"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "Service",
                    "name": "EV Trip Planning",
                    "description": "Plan routes with charging stops"
                  }
                }
              ]
            }
          })
        }}
      />

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {/* Hero Section - Optimized for Conversions */}
          <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20 md:py-32">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    🚨 <span className="text-red-600">Emergency</span> EV Charging Finder
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    <strong>Battery running low?</strong> Find the nearest charging station instantly! 
                    Real-time availability for 50,000+ Tesla, ChargePoint, and Electrify America stations nationwide.
                  </p>
                  
                  {/* Trust Signals */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      ⚡ <strong>50,000+</strong> Stations
                    </span>
                    <span className="flex items-center gap-1">
                      📍 <strong>Real-time</strong> Data
                    </span>
                    <span className="flex items-center gap-1">
                      🌟 <strong>100K+</strong> Users
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button 
                      size="lg" 
                      asChild 
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-6 px-8 animate-pulse"
                      onClick={handleEmergencyClick}
                    >
                      <Link href="/search?location=current">
                        🚨 FIND CHARGING NEAR ME NOW
                      </Link>
                    </Button>
                    
                    {/* Secondary CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
                        <Link href="/charging?station=tesla-van-aken">
                          ✨ Try ChargePal AI Demo
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/search">Browse All Stations</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/trip-planner">Plan Road Trip</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Social Proof */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-muted-foreground mb-2">Trusted by EV drivers nationwide:</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm font-semibold">4.8/5</span>
                      <span className="text-sm text-muted-foreground">(12,483 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                  <HomeMapWrapper />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - SEO Optimized */}
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight">
                  Everything You Need for <span className="text-primary">Emergency EV Charging</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  When your battery is critically low, every second counts. PLUGGIST gets you to a working charger fast.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Emergency Mode</h3>
                  <p className="text-muted-foreground">
                    One-click emergency search finds the absolute nearest working chargers with real-time availability.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">📍</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">GPS Precision</h3>
                  <p className="text-muted-foreground">
                    Accurate GPS location shows exact distances and turn-by-turn directions to save precious battery.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Real-Time Status</h3>
                  <p className="text-muted-foreground">
                    Live availability updates prevent wasted trips to broken or occupied charging stations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Urgency/Scarcity Section */}
          <section className="py-16 bg-red-50">
            <div className="container text-center">
              <h2 className="text-3xl font-bold text-red-700 mb-4">
                Don't Get Stranded With a Dead EV Battery
              </h2>
              <p className="text-lg text-red-600 mb-8 max-w-2xl mx-auto">
                <strong>15% of EV drivers</strong> have experienced range anxiety that left them searching frantically for chargers. 
                Be prepared with PLUGGIST's instant emergency finder.
              </p>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                <Link href="/search?location=current">
                  🆘 Get Emergency Access Now
                </Link>
              </Button>
            </div>
          </section>

          {/* CTA Section - Conversion Optimized */}
          <section className="bg-primary text-primary-foreground py-16">
            <div className="container">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Join 100,000+ Smart EV Drivers
                </h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                  Never worry about running out of charge again. Get instant access to America's most comprehensive EV charging network.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/signup">Start Free Account</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                    <Link href="/premium">Get Premium Access</Link>
                  </Button>
                </div>
                <p className="text-sm opacity-75 mt-4">
                  ✓ Free forever &nbsp;•&nbsp; ✓ No credit card required &nbsp;•&nbsp; ✓ Instant access
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}