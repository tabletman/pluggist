import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { SearchMapWrapper } from "@/components/ui/map-wrapper";
import { SearchFiltersContainer } from "@/components/search/search-filters-container";

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/5 py-8">
          <div className="container">
            <h1 className="text-3xl font-bold mb-4">Find EV Charging Stations</h1>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchFiltersContainer />
              </div>
              <div className="flex-[2] bg-card rounded-lg shadow-sm overflow-hidden">
                <div className="h-[600px]">
                  <SearchMapWrapper />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Search Results</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm border rounded-md px-2 py-1">
                  <option>Distance</option>
                  <option>Rating</option>
                  <option>Availability</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {/* Sample charging station cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/4 bg-muted rounded-md h-40 flex items-center justify-center">
                      <span className="text-muted-foreground">Station Image</span>
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-bold">ChargePoint Station #{i}</h3>
                        <div className="flex items-center">
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">123 Electric Avenue, EV City, CA 90210</p>
                      <div className="flex items-center space-x-1 mb-2">
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
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center space-x-1">
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
                            className="text-primary"
                          >
                            <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path>
                            <line x1="23" y1="13" x2="23" y2="11"></line>
                            <polyline points="11 6 7 12 13 12 9 18"></polyline>
                          </svg>
                          <span className="text-sm">2x CCS, 2x CHAdeMO</span>
                        </div>
                        <div className="flex items-center space-x-1">
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
                            className="text-primary"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span className="text-sm">Open 24/7</span>
                        </div>
                        <div className="flex items-center space-x-1">
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
                            className="text-primary"
                          >
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          <span className="text-sm">$0.43/kWh</span>
                        </div>
                        <div className="flex items-center space-x-1">
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
                            className="text-primary"
                          >
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                            <line x1="6" y1="1" x2="6" y2="4"></line>
                            <line x1="10" y1="1" x2="10" y2="4"></line>
                            <line x1="14" y1="1" x2="14" y2="4"></line>
                          </svg>
                          <span className="text-sm">Restrooms, Food</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm">View Details</Button>
                        <Button size="sm" variant="outline">Get Directions</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}