import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2">Stations</h2>
              <p className="text-3xl font-bold">247</p>
              <p className="text-sm text-muted-foreground mb-4">Total stations in database</p>
              <Button className="w-full">Manage Stations</Button>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2">Users</h2>
              <p className="text-3xl font-bold">1,842</p>
              <p className="text-sm text-muted-foreground mb-4">Registered users</p>
              <Button className="w-full">Manage Users</Button>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-2">Reviews</h2>
              <p className="text-3xl font-bold">5,621</p>
              <p className="text-sm text-muted-foreground mb-4">User-submitted reviews</p>
              <Button className="w-full">Moderate Reviews</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { action: 'New station added', details: 'Tesla Supercharger - San Francisco, CA', time: '2 hours ago' },
                    { action: 'Station updated', details: 'ChargePoint Station #42 - Updated connector information', time: '4 hours ago' },
                    { action: 'New review', details: '⭐⭐⭐⭐⭐ for EVgo Fast Charging - Los Angeles, CA', time: '5 hours ago' },
                    { action: 'User registered', details: 'john.smith@example.com', time: '6 hours ago' },
                    { action: 'Station claimed', details: 'Electrify America - Seattle, WA', time: '8 hours ago' },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.details}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">View All Activity</Button>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Station Claim Request</h3>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <p className="text-sm mb-2">ChargePoint Station #123 - Portland, OR</p>
                    <p className="text-sm text-muted-foreground mb-4">Requested by: business@example.com</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Review Details</Button>
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="destructive">Reject</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">New Station Submission</h3>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <p className="text-sm mb-2">Green Energy Charging - Austin, TX</p>
                    <p className="text-sm text-muted-foreground mb-4">Submitted by: user@example.com</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Review Details</Button>
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="destructive">Reject</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Reported Issue</h3>
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">Urgent</span>
                    </div>
                    <p className="text-sm mb-2">EVgo Station - Chicago, IL</p>
                    <p className="text-sm text-muted-foreground mb-4">Issue: All chargers out of service</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm">Mark as Resolved</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button className="w-full">Add New Station</Button>
                  <Button className="w-full" variant="outline">Import Stations</Button>
                  <Button className="w-full" variant="outline">Export Data</Button>
                  <Button className="w-full" variant="outline">Generate Reports</Button>
                  <Button className="w-full" variant="outline">System Settings</Button>
                </div>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">System Status</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Database</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Services</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Search Index</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authentication</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span className="text-yellow-600 font-medium">80% Used</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Last updated: April 18, 2025 21:30 UTC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
