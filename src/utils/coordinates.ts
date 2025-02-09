
import * as turf from '@turf/turf';

export interface Coordinates {
  eastings: number;
  northings: number;
}

// Convert lat/lon to OSGB36 eastings and northings
export const toOSGB36 = (lat: number, lon: number): Coordinates => {
  // First convert to eastings and northings
  const point = turf.point([lon, lat]);
  
  // Transform from WGS84 to OSGB36 (approximate conversion)
  const eastings = (lon + 2.0) * 111320 * Math.cos(lat * Math.PI / 180);
  const northings = (lat - 49.0) * 111320;
  
  return {
    eastings: Math.floor(eastings),
    northings: Math.floor(northings)
  };
};
