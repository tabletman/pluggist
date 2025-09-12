import { InstallationReferral } from '@/components/InstallationReferral';
import { TeslaReferral } from '@/components/TeslaReferral';
import { Suspense } from 'react';

function InstallationForm() {
  return <InstallationReferral />;
}

export default function SuggestInstallationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Suggest a Charging Installation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Know a business that needs EV charging? Submit a lead and earn money when they install 
            through our certified electrician partners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<div>Loading form...</div>}>
              <InstallationForm />
            </Suspense>
          </div>
          
          <div className="space-y-6">
            <TeslaReferral />
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-3">💰 How You Earn</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Installation completed:</span>
                  <span className="font-medium text-green-600">$25-75</span>
                </div>
                <div className="flex justify-between">
                  <span>User referrals:</span>
                  <span className="font-medium text-blue-600">$25 each</span>
                </div>
                <div className="flex justify-between">
                  <span>Tesla sales:</span>
                  <span className="font-medium text-red-600">$1,000 each</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Payments processed monthly via PayPal. Minimum payout $10.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}