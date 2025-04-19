import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function ForBusinessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                Grow Your Business with PLUGGIST
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Connect with EV drivers and increase visibility for your charging stations. 
                Our premium business solutions help you reach more customers and grow your revenue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="#premium-listings">Premium Listings</a>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <a href="#claim-listing">Claim Your Listing</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Partner with PLUGGIST?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Increased Visibility</h3>
                <p className="text-muted-foreground">
                  Get your charging stations in front of thousands of EV drivers actively looking for places to charge.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 20V10"></path>
                    <path d="M18 20V4"></path>
                    <path d="M6 20v-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Gain insights into how users interact with your listings, including views, direction requests, and more.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                    <circle cx="9" cy="13" r="1"></circle>
                    <circle cx="13" cy="13" r="1"></circle>
                    <path d="M21 9h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H17"></path>
                    <path d="M19 8v1"></path>
                    <path d="M19 15v1"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Revenue Growth</h3>
                <p className="text-muted-foreground">
                  Increase station utilization and revenue by reaching EV drivers when they need charging the most.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Listings Section */}
        <section id="premium-listings" className="py-16 bg-primary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Premium Listing Plans</h2>
              <p className="text-lg text-muted-foreground">
                Choose the right plan to showcase your charging stations and reach more EV drivers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Basic</h3>
                  <div className="text-3xl font-bold mb-1">$29<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                  <p className="text-sm text-muted-foreground mb-6">per station</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Enhanced visibility in search results</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Business profile management</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Basic analytics dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Email support</span>
                    </li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-card rounded-lg shadow-md overflow-hidden border-2 border-primary relative">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                  Most Popular
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Premium</h3>
                  <div className="text-3xl font-bold mb-1">$79<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                  <p className="text-sm text-muted-foreground mb-6">per station</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Featured placement in search results</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Custom branding and promotional badges</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Advanced analytics dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Review management tools</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Priority email and phone support</span>
                    </li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold mb-1">Custom<span className="text-lg font-normal text-muted-foreground"> pricing</span></div>
                  <p className="text-sm text-muted-foreground mb-6">for charging networks</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>All Premium features</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>API integration for real-time updates</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Bulk station management</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>White-label solutions</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                  <Button className="w-full">Contact Sales</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Claim Listing Section */}
        <section id="claim-listing" className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Claim Your Listing</h2>
                <p className="text-lg text-muted-foreground">
                  Already have a charging station listed on PLUGGIST? Claim your listing to gain control over your business information.
                </p>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      placeholder="Enter your business name"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="stationAddress" className="block text-sm font-medium mb-1">
                      Station Address
                    </label>
                    <input
                      type="text"
                      id="stationAddress"
                      placeholder="Enter the station address"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        placeholder="Your full name"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        placeholder="Your email address"
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="verificationDetails" className="block text-sm font-medium mb-1">
                      Verification Details
                    </label>
                    <textarea
                      id="verificationDetails"
                      rows={3}
                      placeholder="Please provide details that can help us verify you are the owner of this charging station"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    ></textarea>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="termsAgreement"
                      className="mt-1 mr-2"
                    />
                    <label htmlFor="termsAgreement" className="text-sm">
                      I confirm that I am authorized to claim this listing and agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                    </label>
                  </div>
                  
                  <Button className="w-full">Submit Claim Request</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-primary/5">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Business Partners Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-yellow-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Since listing our charging stations on PLUGGIST, we've seen a 40% increase in utilization. The platform's visibility and user-friendly interface have been game-changers for our business."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
                  <div>
                    <div className="font-medium">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">EcoCharge Network</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-yellow-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The analytics dashboard provides invaluable insights into how EV drivers interact with our stations. This data has helped us optimize our offerings and improve customer satisfaction."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
                  <div>
                    <div className="font-medium">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">GreenWatt Charging</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={star <= 4 ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-yellow-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a small business owner with just two charging stations, I was hesitant about the investment. But the increased foot traffic and additional sales in our cafe have more than paid for the premium listing."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-muted mr-3"></div>
                  <div>
                    <div className="font-medium">Emma Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Volt Cafe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Charging Business?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of charging station operators who trust PLUGGIST to connect them with EV drivers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">Get Started</Button>
                <Button size="lg" variant="outline">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
