
import { LocationTracker } from "@/components/LocationTracker";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Location Tracker</h1>
          <p className="text-gray-600">Record locations with custom details</p>
        </header>
        <LocationTracker />
      </div>
    </div>
  );
};

export default Index;
