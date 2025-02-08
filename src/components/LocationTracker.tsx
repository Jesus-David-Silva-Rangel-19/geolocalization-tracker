
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: string;
  timestamp: number;
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  species?: string;
  health?: string;
}

export const LocationTracker = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const generateReference = () => {
    return `LOC-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
  };

  const recordLocation = () => {
    setIsRecording(true);
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setIsRecording(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: Location = {
          id: generateReference(),
          timestamp: Date.now(),
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
        };
        setLocations(prev => [newLocation, ...prev]);
        toast({
          title: "Location Recorded",
          description: `Reference: ${newLocation.id}`,
        });
        setIsRecording(false);
      },
      (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setIsRecording(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-md mx-auto">
      <Button
        onClick={recordLocation}
        disabled={isRecording}
        className="w-32 h-32 rounded-full bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex flex-col items-center justify-center gap-2"
      >
        <MapPin className="w-8 h-8" />
        <span className="text-sm font-medium">
          {isRecording ? "Recording..." : "Record"}
        </span>
      </Button>

      <div className="w-full space-y-4">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
};

const LocationCard = ({ location }: { location: Location }) => {
  const [species, setSpecies] = useState(location.species || '');
  const [health, setHealth] = useState(location.health || '');
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would sync with a backend
    toast({
      title: "Details Updated",
      description: "Location details have been saved",
    });
  };

  return (
    <Card className="p-4 space-y-4 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">Reference</p>
          <p className="text-lg font-semibold">{location.id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {new Date(location.timestamp).toLocaleTimeString()}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(location.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">Latitude</label>
          <p className="font-mono text-sm">{location.coords.latitude.toFixed(6)}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Longitude</label>
          <p className="font-mono text-sm">{location.coords.longitude.toFixed(6)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="w-full p-2 text-sm border rounded"
        />
        <input
          type="text"
          placeholder="Health Status"
          value={health}
          onChange={(e) => setHealth(e.target.value)}
          className="w-full p-2 text-sm border rounded"
        />
        <Button 
          onClick={handleSave}
          variant="outline" 
          className="w-full mt-2"
        >
          Save Details
        </Button>
      </div>
    </Card>
  );
};
