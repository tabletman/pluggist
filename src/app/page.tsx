import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20 md:py-32">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Find the perfect charging spot for your EV journey
                </h1>
                <p className="text-xl text-muted-foreground">
                  Locate reliable EV charging stations with real-time availability, reviews, and amenities. Plan your trips with confidence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/search">Find Charging Stations</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/trip-planner">Plan a Trip</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-muted">
                {/* Placeholder for map or image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Interactive Map Preview
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need for stress-free EV charging
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                PLUGGIST helps you find and navigate to the best charging stations for your electric vehicle.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                    <path d="M16.5 9.4 7.55 4.24"></path>
                    <polyline points="3.29 7 12 12 20.71 7"></polyline>
                    <line x1="12" y1="22" x2="12" y2="12"></line>
                    <circle cx="18.5" cy="15.5" r="2.5"></circle>
                    <path d="M20.27 17.27 22 19"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Find Stations</h3>
                <p className="text-muted-foreground">
                  Locate charging stations near you with detailed information about connectors, pricing, and amenities.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Plan Trips</h3>
                <p className="text-muted-foreground">
                  Plan your journey with optimal charging stops based on your vehicle's range and charging preferences.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Read Reviews</h3>
                <p className="text-muted-foreground">
                  See what other EV drivers are saying about charging stations and share your own experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Ready to simplify your EV charging experience?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Join thousands of EV drivers who use PLUGGIST to find reliable charging stations and plan their journeys.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
