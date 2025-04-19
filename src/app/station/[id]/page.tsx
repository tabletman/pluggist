import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function StationDetailPage({ params }: { params: { id: string } }) {
  // In a real implementation, we would fetch station data based on the ID
  const stationId = params.id;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">ChargePoint Station #{stationId}</h1>
                <p className="text-muted-foreground">123 Electric Avenue, EV City, CA 90210</p>
                <div className="flex items-center mt-2 space-x-1">
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
                  <span className="text-sm text-muted-foreground">(42 reviews)</span>
                </div>
              </div>

              {/* Station Photos */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-muted h-32 rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">Photo {i}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charging Options */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Charging Options</h2>
                <div className="bg-card rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">CCS Connector</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Power Output:</span>
                          <span className="font-medium">50 kW</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-medium">$0.43/kWh</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-medium">2 ports</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Status:</span>
                          <span className="text-green-600 font-medium">Available</span>
                        </li>
                      </ul>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">CHAdeMO Connector</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Power Output:</span>
                          <span className="font-medium">50 kW</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-medium">$0.43/kWh</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-medium">2 ports</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Status:</span>
                          <span className="text-green-600 font-medium">Available</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Payment methods: Credit Card, ChargePoint App, RFID Card</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Restrooms', 'Food', 'Coffee', 'WiFi', '24/7 Access', 'Parking', 'Shopping', 'Seating'].map((amenity, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Reviews</h2>
                  <Button>Write a Review</Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <div>
                          <span className="font-medium">User{i}</span>
                          <div className="flex items-center mt-1 space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill={star <= (5 - i) ? "currentColor" : "none"}
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
                        </div>
                        <span className="text-sm text-muted-foreground">March 15, 2025</span>
                      </div>
                      <p className="text-sm">
                        {i === 1 
                          ? "Great charging station! All ports were working and the location has nice amenities. Will definitely use again." 
                          : i === 2 
                            ? "Decent experience. One of the CCS connectors was out of service, but the other worked fine. The cafe next door has good coffee." 
                            : "Location is convenient but pricing is a bit high compared to other stations in the area."}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">View All Reviews</Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-card rounded-lg overflow-hidden shadow-sm">
                <div className="h-64 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Map Location</span>
                </div>
                <div className="p-4 space-y-4">
                  <Button className="w-full">Get Directions</Button>
                  <Button variant="outline" className="w-full">Save to Favorites</Button>
                </div>
              </div>

              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-bold mb-2">Operating Hours</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">24 hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">24 hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">24 hours</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-bold mb-2">Network Information</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <span>ChargePoint Network</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  This station is part of the ChargePoint network. ChargePoint account or credit card required for payment.
                </p>
                <a href="#" className="text-sm text-primary hover:underline">
                  Visit ChargePoint Website
                </a>
              </div>

              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-bold mb-2">Nearby Attractions</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">EV City Mall</span> - 0.1 miles
                  </li>
                  <li>
                    <span className="font-medium">Electric Cafe</span> - 0.2 miles
                  </li>
                  <li>
                    <span className="font-medium">Volt Park</span> - 0.5 miles
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-4 shadow-sm">
                <h3 className="font-bold mb-2">Report an Issue</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Is this station out of service or information incorrect?
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Report Problem
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
