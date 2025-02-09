
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Location } from "@/types/location";
import { toOSGB36 } from "@/utils/coordinates";
import { LocationCard } from "./LocationCard";

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
        const coordinates = toOSGB36(position.coords.latitude, position.coords.longitude);
        const newLocation: Location = {
          id: generateReference(),
          timestamp: Date.now(),
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          eastings: coordinates.eastings,
          northings: coordinates.northings
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
          <LocationCard 
            key={location.id} 
            location={location}
            existingSpecies={[...new Set(locations.map(loc => loc.species).filter(Boolean))]}
          />
        ))}
      </div>
    </div>
  );
};
