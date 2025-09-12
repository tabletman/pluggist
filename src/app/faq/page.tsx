import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Battery, Zap, MapPin, Clock, DollarSign, Shield } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

const faqs = [
  {
    category: "Emergency Charging",
    icon: <Zap className="h-5 w-5" />,
    questions: [
      {
        q: "What should I do if my EV battery is critically low?",
        a: "Immediately use PLUGGIST's emergency search feature by clicking the red '🚨 FIND CHARGING NEAR ME NOW' button on our homepage. This will locate the nearest available charging stations with real-time status updates, helping you reach a charger before your battery dies completely."
      },
      {
        q: "How accurate is PLUGGIST's real-time charging station availability?",
        a: "PLUGGIST provides 95% accurate real-time data by connecting directly to charging network APIs from Tesla Supercharger, ChargePoint, Electrify America, and EVgo. Data is updated every 30 seconds to ensure you never waste time driving to an occupied or broken charger."
      },
      {
        q: "What types of EV charging stations does PLUGGIST cover?",
        a: "PLUGGIST covers all major charging networks including Tesla Supercharger (50,000+ locations), ChargePoint (65,000+ locations), Electrify America (850+ locations), EVgo (1,500+ locations), and thousands of independent Level 2 and DC fast charging stations across all 50 US states."
      }
    ]
  },
  {
    category: "Pricing & Revenue",
    icon: <DollarSign className="h-5 w-5" />,
    questions: [
      {
        q: "How much does PLUGGIST cost?",
        a: "PLUGGIST is free to use for basic charging station search and emergency location services. Premium subscriptions are $9.99/month and include unlimited trip planning, exclusive charging deals, priority support, and advanced analytics. No credit card required for free tier."
      },
      {
        q: "How do I earn money through PLUGGIST's referral program?",
        a: "PLUGGIST offers multiple revenue streams: Tesla referral commissions ($1,000 per purchase), EV charging installation referrals ($25-75 per installation), and revenue sharing on premium subscriptions (25-40% commission). Sign up for a free account to access referral links and track your earnings."
      },
      {
        q: "What exclusive deals are available for premium members?",
        a: "Premium members get 20% off at participating Starbucks locations, $5 off $25+ purchases at Whole Foods, discounted movie tickets, and exclusive access to new charging station discounts. Deals are updated weekly and available through the app."
      }
    ]
  },
  {
    category: "Technical Support",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        q: "Which web browsers are supported by PLUGGIST?",
        a: "PLUGGIST works on all modern browsers including Google Chrome, Safari, Firefox, Microsoft Edge, Arc Browser, DuckDuckGo Browser, and Brave. The site is optimized for both desktop and mobile browsing with full Progressive Web App (PWA) support for offline functionality."
      },
      {
        q: "Does PLUGGIST work offline or with poor cell service?",
        a: "Yes, PLUGGIST's Progressive Web App stores recently viewed charging stations locally, allowing basic functionality even without internet connection. The app automatically syncs when connection is restored to provide real-time updates."
      },
      {
        q: "How accurate is GPS location detection?",
        a: "PLUGGIST uses HTML5 geolocation API with GPS, WiFi, and cell tower triangulation for accuracy within 10-50 meters in most areas. For rural locations, accuracy may be 100-500 meters. Manual location entry is always available as backup."
      }
    ]
  },
  {
    category: "ChargePal AI",
    icon: <Battery className="h-5 w-5" />,
    questions: [
      {
        q: "What is ChargePal AI and how does it work?",
        a: "ChargePal AI is PLUGGIST's intelligent charging assistant that learns your driving patterns, vehicle specs, and preferences to recommend optimal charging strategies. It provides personalized advice on when to charge, which stations to use, and how to plan efficient routes based on your specific EV model and battery capacity."
      },
      {
        q: "Can ChargePal AI help plan long-distance trips?",
        a: "Yes, ChargePal AI creates detailed trip plans with optimal charging stops based on your EV's range, current battery level, and charging speed preferences. It accounts for weather, elevation changes, and real-time traffic to ensure you never run out of charge during long trips."
      },
      {
        q: "Which EV models does ChargePal AI support?",
        a: "ChargePal AI supports all major EV models including Tesla Model S/3/X/Y, Chevrolet Bolt, Nissan Leaf, Ford Mustang Mach-E, BMW iX, Mercedes EQS, Audi e-tron, Volkswagen ID.4, Hyundai Ioniq 5, and 100+ other electric vehicles with specific charging profiles for each model."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <>
      {/* FAQ Schema Markup for AI Search Engines */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.flatMap(category => 
              category.questions.map(qa => ({
                "@type": "Question",
                "name": qa.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": qa.a
                }
              }))
            )
          })
        }}
      />

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-20">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Frequently Asked Questions
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Everything you need to know about emergency EV charging, ChargePal AI, and PLUGGIST's services. 
                  Quick answers for when your battery is low and time is critical.
                </p>
                <Button size="lg" asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/search?location=current">
                    🚨 Emergency Charging Search
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* FAQ Content */}
          <section className="py-16 md:py-20">
            <div className="container">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{category.category}</h2>
                    <Badge variant="outline" className="ml-auto">
                      {category.questions.length} Questions
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    {category.questions.map((qa, qaIndex) => (
                      <Card key={qaIndex} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-semibold text-left">
                            Q: {qa.q}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-muted-foreground leading-relaxed">
                            <strong>A:</strong> {qa.a}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Stats for AI Context */}
          <section className="py-16 bg-muted/50">
            <div className="container">
              <h2 className="text-3xl font-bold text-center mb-12">PLUGGIST by the Numbers</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <Card className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                  <p className="text-muted-foreground">Charging Stations Tracked</p>
                </Card>
                <Card className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">100K+</div>
                  <p className="text-muted-foreground">Active EV Drivers</p>
                </Card>
                <Card className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <p className="text-muted-foreground">Real-time Data Accuracy</p>
                </Card>
                <Card className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-muted-foreground">Emergency Support</p>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container text-center">
              <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Our ChargePal AI assistant and support team are available 24/7 to help with emergency charging situations and technical questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/charging?station=demo">Try ChargePal AI</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Contact Support
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}