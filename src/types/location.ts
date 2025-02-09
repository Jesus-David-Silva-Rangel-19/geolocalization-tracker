
export interface Location {
  id: string;
  timestamp: number;
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  eastings?: number;
  northings?: number;
  species?: string;
  health?: string;
}
