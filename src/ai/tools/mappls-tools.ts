import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { searchNearby, getDistance, geocode, reverseGeocode } from '@/services/mappls';

/**
 * Tool to find nearby places using Mappls.
 */
export const findNearbyPlaces = ai.defineTool(
  {
    name: 'findNearbyPlaces',
    description: 'Searches for points of interest (hospitals, gas stations, etc.) around a specific coordinate or city.',
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
 * Tool to calculate travel time and distance between two locations.
 */
export const calculateTravelInfo = ai.defineTool(
  {
    name: 'calculateTravelInfo',
    description: 'Calculates the driving distance and estimated time between two sets of coordinates.',
    inputSchema: z.object({
      origin: z.string().describe('Starting "lat,lng" coordinates.'),
      destination: z.string().describe('Ending "lat,lng" coordinates.'),
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
 * Alias for calculateTravelInfo for emergency dispatch flows.
 */
export const getOptimalRoute = ai.defineTool(
  {
    name: 'getOptimalRoute',
    description: 'Calculates the most precise and fastest route for an emergency responder.',
    inputSchema: z.object({
      origin: z.string().describe('Responder location "lat,lng".'),
      destination: z.string().describe('Emergency location "lat,lng".'),
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
 * Tool to evaluate multiple dispatch options (Distance Matrix concept).
 */
export const evaluateDispatchOptions = ai.defineTool(
  {
    name: 'evaluateDispatchOptions',
    description: 'Compares multiple origins to a single destination to find the fastest responder.',
    inputSchema: z.object({
      origins: z.array(z.string()).describe('List of responder locations as "lat,lng" strings.'),
      destination: z.string().describe('Emergency site as "lat,lng".'),
    }),
    outputSchema: z.array(z.object({
      origin: z.string(),
      distanceKm: z.number(),
      durationMinutes: z.number(),
    })),
  },
  async (input) => {
    const results = await Promise.all(
      input.origins.map(async (origin) => {
        const info = await getDistance(origin, input.destination);
        return {
          origin,
          distanceKm: info.distance,
          durationMinutes: info.duration
        };
      })
    );
    return results;
  }
);

/**
 * Tool to convert an address into GPS coordinates.
 */
export const geocodeAddress = ai.defineTool(
  {
    name: 'geocodeAddress',
    description: 'Converts a physical address or place name into geographic coordinates (latitude and longitude).',
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

/**
 * Tool to convert coordinates into a physical address.
 */
export const reverseGeocodeCoords = ai.defineTool(
  {
    name: 'reverseGeocodeCoords',
    description: 'Converts latitude and longitude coordinates into a human-readable address.',
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
 * Alias for reverseGeocodeCoords for dispatch flows.
 */
export const getAddressFromCoords = ai.defineTool(
  {
    name: 'getAddressFromCoords',
    description: 'Verifies the physical street address of GPS coordinates.',
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
