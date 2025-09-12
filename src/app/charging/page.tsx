import { Suspense } from 'react';
import { ChargingContent } from './charging-content';

export default function ChargingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading charging session...</p>
        </div>
      </div>
    }>
      <ChargingContent />
    </Suspense>
  );
}