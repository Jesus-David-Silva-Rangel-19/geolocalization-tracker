
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Location } from "@/types/location";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationCardProps {
  location: Location;
  existingSpecies: string[];
}

export const LocationCard = ({ location, existingSpecies }: LocationCardProps) => {
  const [species, setSpecies] = useState(location.species || '');
  const [customSpecies, setCustomSpecies] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [health, setHealth] = useState(location.health || '');
  const { toast } = useToast();

  const handleSpeciesChange = (value: string) => {
    if (value === 'custom') {
      setIsCustom(true);
      setSpecies('');
      setCustomSpecies('');
    } else {
      setIsCustom(false);
      setSpecies(value);
      setCustomSpecies('');
    }
  };

  const handleCustomSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSpecies(value);
    setSpecies(value);
  };

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">Eastings</label>
          <p className="font-mono text-sm">{location.eastings}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Northings</label>
          <p className="font-mono text-sm">{location.northings}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Select value={isCustom ? 'custom' : species} onValueChange={handleSpeciesChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select species" />
          </SelectTrigger>
          <SelectContent>
            {existingSpecies.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
            <SelectItem value="custom">Enter new species</SelectItem>
          </SelectContent>
        </Select>

        {isCustom && (
          <Input
            type="text"
            placeholder="Enter new species"
            value={customSpecies}
            onChange={handleCustomSpeciesChange}
            className="mt-2"
          />
        )}

        <Input
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
