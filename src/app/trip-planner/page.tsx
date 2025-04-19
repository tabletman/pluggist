import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function TripPlannerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/5 py-8">
          <div className="container">
            <h1 className="text-3xl font-bold mb-4">EV Trip Planner</h1>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Plan your journey with optimal charging stops based on your vehicle's range and preferences. 
              Our trip planner helps you find the most efficient route with reliable charging stations.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-sm p-4 space-y-6">
                  <div>
                    <label htmlFor="start" className="block text-sm font-medium mb-1">
                      Starting Point
                    </label>
                    <input
                      type="text"
                      id="start"
                      placeholder="Enter address, city, or zip code"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="destination" className="block text-sm font-medium mb-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      id="destination"
                      placeholder="Enter address, city, or zip code"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="vehicle" className="block text-sm font-medium mb-1">
                      Vehicle Model
                    </label>
                    <select
                      id="vehicle"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="">Select your vehicle</option>
                      <option value="tesla_model_3">Tesla Model 3</option>
                      <option value="tesla_model_y">Tesla Model Y</option>
                      <option value="chevy_bolt">Chevrolet Bolt</option>
                      <option value="nissan_leaf">Nissan Leaf</option>
                      <option value="ford_mach_e">Ford Mustang Mach-E</option>
                      <option value="hyundai_ioniq5">Hyundai IONIQ 5</option>
                      <option value="kia_ev6">Kia EV6</option>
                      <option value="vw_id4">Volkswagen ID.4</option>
                      <option value="custom">Custom Range...</option>
                    </select>
                  </div>
                  
                  <div id="customRangeSection" className="hidden">
                    <label htmlFor="customRange" className="block text-sm font-medium mb-1">
                      Custom Range (miles)
                    </label>
                    <input
                      type="number"
                      id="customRange"
                      placeholder="Enter range in miles"
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Charging Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">DC Fast Charging</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Level 2 Charging</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Tesla Superchargers Only</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Additional Options</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Prioritize highly rated stations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Include amenities (food, restrooms)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Avoid highways</span>
                      </label>
                    </div>
                  </div>
                  
                  <Button className="w-full">Plan My Trip</Button>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                  <div className="h-[600px] bg-muted flex items-center justify-center">
                    <div className="text-center p-8">
                      <h3 className="text-xl font-medium mb-2">Trip Map</h3>
                      <p className="text-muted-foreground">
                        Your route with charging stops will appear here after planning
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Trip Details</h2>
            
            <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium">San Francisco, CA to Los Angeles, CA</h3>
                  <p className="text-muted-foreground">Tesla Model 3 Long Range</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-sm text-muted-foreground">Total Distance: <span className="font-medium">380 miles</span></p>
                  <p className="text-sm text-muted-foreground">Estimated Travel Time: <span className="font-medium">7 hours 15 minutes</span></p>
                  <p className="text-sm text-muted-foreground">Charging Stops: <span className="font-medium">2</span></p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                    </div>
                    <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <h4 className="font-medium">Start: San Francisco, CA</h4>
                    <p className="text-sm text-muted-foreground">Departure at 9:00 AM</p>
                    <p className="text-sm text-muted-foreground">Battery: 100% (310 miles range)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path>
                        <line x1="23" y1="13" x2="23" y2="11"></line>
                        <polyline points="11 6 7 12 13 12 9 18"></polyline>
                      </svg>
                    </div>
                    <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <h4 className="font-medium">Charging Stop: Tesla Supercharger - Gilroy, CA</h4>
                    <p className="text-sm text-muted-foreground">Arrival at 10:30 AM (Battery: 30%)</p>
                    <p className="text-sm text-muted-foreground">Charging Time: 25 minutes (30% → 80%)</p>
                    <p className="text-sm text-muted-foreground">Amenities: Restrooms, Food, Shopping</p>
                    <Button variant="outline" size="sm" className="mt-2">View Station Details</Button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path>
                        <line x1="23" y1="13" x2="23" y2="11"></line>
                        <polyline points="11 6 7 12 13 12 9 18"></polyline>
                      </svg>
                    </div>
                    <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <h4 className="font-medium">Charging Stop: Tesla Supercharger - Tejon Ranch, CA</h4>
                    <p className="text-sm text-muted-foreground">Arrival at 2:15 PM (Battery: 20%)</p>
                    <p className="text-sm text-muted-foreground">Charging Time: 30 minutes (20% → 80%)</p>
                    <p className="text-sm text-muted-foreground">Amenities: Restrooms, Food, Coffee</p>
                    <Button variant="outline" size="sm" className="mt-2">View Station Details</Button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <rect x="9" y="9" width="6" height="6"></rect>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Destination: Los Angeles, CA</h4>
                    <p className="text-sm text-muted-foreground">Arrival at 4:15 PM</p>
                    <p className="text-sm text-muted-foreground">Battery: 35% (approximately 110 miles remaining)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button>Save Trip</Button>
              <Button variant="outline">Export Directions</Button>
              <Button variant="outline">Modify Trip</Button>
            </div>
          </div>
        </section>
        
        <section className="py-8 bg-primary/5">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Trip Planning Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">Plan for Buffer</h3>
                <p className="text-muted-foreground">
                  Always plan to arrive at charging stations with at least 10-15% battery remaining to account for unexpected factors like weather, traffic, or station issues.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">Consider Weather</h3>
                <p className="text-muted-foreground">
                  Cold weather can reduce your EV's range by 10-40%. Adjust your trip plan accordingly during winter months or in cold climates.
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3">Check Alternatives</h3>
                <p className="text-muted-foreground">
                  Always have backup charging stations in mind in case your planned stop is occupied, out of service, or inaccessible.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
