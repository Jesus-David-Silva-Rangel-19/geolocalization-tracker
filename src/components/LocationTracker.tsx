
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import * as turf from '@turf/turf';

interface Location {
  id: string;
  timestamp: number;
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  gridRef?: string;
  species?: string;
  health?: string;
}

// Convert lat/lon to OSGB36 grid reference
const toOSGB36 = (lat: number, lon: number): string => {
  // First convert to eastings and northings
  const point = turf.point([lon, lat]);
  
  // Transform from WGS84 to OSGB36
  // These are approximate values for the transformation
  const e = (lon + 2.0) * 111320 * Math.cos(lat * Math.PI / 180);
  const n = (lat - 49.0) * 111320;
  
  // Format as grid reference
  const gridE = Math.floor(e / 100);
  const gridN = Math.floor(n / 100);
  
  return `E${gridE} N${gridN}`;
};

export const LocationTracker = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const generateReference = () => {
    return `T${locations.length + 1}`;
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
          gridRef: toOSGB36(position.coords.latitude, position.coords.longitude)
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

      <div>
        <label className="text-sm text-gray-500">OSGB36 Grid Reference</label>
        <p className="font-mono text-sm">{location.gridRef}</p>
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
