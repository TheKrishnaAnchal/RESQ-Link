import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { searchNearby, getDistance, geocode } from '@/services/mappls';

/**
 * Tool to find nearby emergency services using Mappls.
 */
export const findNearbyEmergencyServices = ai.defineTool(
  {
    name: 'findNearbyEmergencyServices',
    description: 'Searches for the nearest emergency services (hospitals, fire stations, police) based on a location.',
    inputSchema: z.object({
      serviceType: z.string().describe('Type of service to search for, e.g., "Hospital", "Fire Station", "Police".'),
      location: z.string().describe('Coordinates string "lat,lng" to search around.'),
      radius: z.number().optional().describe('Search radius in meters. Default is 5000.'),
    }),
    outputSchema: z.array(z.object({
      name: z.string(),
      address: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      distance: z.number().optional(),
    })),
  },
  async (input) => {
    const results = await searchNearby(input.serviceType, input.location, input.radius);
    return results.map(r => ({
      name: r.placeName,
      address: r.placeAddress,
      latitude: r.latitude,
      longitude: r.longitude,
      distance: r.distance
    }));
  }
);

/**
 * Tool to calculate travel time and distance using Mappls.
 */
export const calculateTravelInfo = ai.defineTool(
  {
    name: 'calculateTravelInfo',
    description: 'Calculates the distance and estimated time of arrival between two coordinates.',
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
 * Tool to convert an address into coordinates.
 */
export const geocodeAddress = ai.defineTool(
  {
    name: 'geocodeAddress',
    description: 'Converts a human-readable address into GPS coordinates.',
    inputSchema: z.object({
      address: z.string().describe('The full address to geocode.'),
    }),
    outputSchema: z.object({
      latitude: z.number(),
      longitude: z.number(),
      formattedAddress: z.string(),
    }).nullable(),
  },
  async (input) => {
    const result = await geocode(input.address);
    if (!result) return null;
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      formattedAddress: result.placeAddress,
    };
  }
);
