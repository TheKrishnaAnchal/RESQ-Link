import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { searchNearby, getDistance, geocode, reverseGeocode, getDistanceMatrix } from '@/services/mappls';

/**
 * Tool to find nearby places using Mappls. (Nearby Search API)
 */
export const findNearbyPlaces = ai.defineTool(
  {
    name: 'findNearbyPlaces',
    description: 'Searches for points of interest (hospitals, gas stations, fire hydrants) around a specific coordinate or city.',
    inputSchema: z.object({
      query: z.string().describe('What to search for, e.g., "Hospital", "Police Station".'),
      location: z.string().describe('Coordinates string "lat,lng" or a city name.'),
      radius: z.number().optional().describe('Search radius in meters. Default is 5000.'),
    }),
    outputSchema: z.array(z.object({
      name: z.string(),
      address: z.string(),
      distance: z.number().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })),
  },
  async (input) => {
    const results = await searchNearby(input.query, input.location, input.radius);
    return results.map(r => ({
      name: r.placeName,
      address: r.placeAddress,
      distance: r.distance,
      lat: r.latitude,
      lng: r.longitude
    }));
  }
);

/**
 * Tool to evaluate multiple dispatch options. (Distance Matrix API)
 */
export const evaluateDispatchOptions = ai.defineTool(
  {
    name: 'evaluateDispatchOptions',
    description: 'Evaluates travel time for multiple units simultaneously to find the optimal responder.',
    inputSchema: z.object({
      origin: z.string().describe('User "lat,lng" coordinates.'),
      unitLocations: z.array(z.string()).describe('List of responder "lat,lng" coordinates.'),
    }),
    outputSchema: z.array(z.object({
      destination: z.string(),
      distanceKm: z.number(),
      durationMinutes: z.number(),
    })),
  },
  async (input) => {
    return await getDistanceMatrix(input.origin, input.unitLocations);
  }
);

/**
 * Tool to get the optimal turn-by-turn route. (Routing API)
 */
export const getOptimalRoute = ai.defineTool(
  {
    name: 'getOptimalRoute',
    description: 'Generates the optimal turn-by-turn driving path and precise ETA between two points.',
    inputSchema: z.object({
      origin: z.string().describe('Starting "lat,lng".'),
      destination: z.string().describe('Ending "lat,lng".'),
    }),
    outputSchema: z.object({
      distanceKm: z.number(),
      durationMinutes: z.number(),
    }),
  },
  async (input) => {
    const info = await getDistance(input.origin, input.destination);
    return {
      distanceKm: info.distance,
      durationMinutes: info.duration
    };
  }
);

/**
 * Tool to convert coordinates into a physical address. (Reverse Geocoding)
 */
export const getAddressFromCoords = ai.defineTool(
  {
    name: 'getAddressFromCoords',
    description: 'Converts latitude and longitude coordinates into a human-readable street address.',
    inputSchema: z.object({
      lat: z.number().describe('Latitude.'),
      lng: z.number().describe('Longitude.'),
    }),
    outputSchema: z.object({
      address: z.string(),
    }),
  },
  async (input) => {
    const address = await reverseGeocode(input.lat, input.lng);
    return { address: address || "Unknown location" };
  }
);

/**
 * Tool to convert an address into GPS coordinates. (Geocoding)
 */
export const geocodeAddress = ai.defineTool(
  {
    name: 'geocodeAddress',
    description: 'Converts a physical address or place name into geographic coordinates.',
    inputSchema: z.object({
      address: z.string().describe('The address or place name to geocode.'),
    }),
    outputSchema: z.object({
      lat: z.number(),
      lng: z.number(),
      formattedAddress: z.string(),
    }),
  },
  async (input) => {
    const result = await geocode(input.address);
    if (!result) throw new Error("Address not found");
    return {
      lat: result.latitude,
      lng: result.longitude,
      formattedAddress: result.placeAddress
    };
  }
);
