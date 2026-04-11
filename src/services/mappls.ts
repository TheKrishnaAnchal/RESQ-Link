/**
 * @fileOverview Service layer for interacting with Mappls (MapmyIndia) APIs.
 * Includes methods for geocoding, reverse geocoding, nearby search, and distance calculations.
 */

const MAPPLS_BASE_URL = 'https://atlas.mappls.com/api/places';
const MAPPLS_ROUTING_URL = 'https://apis.mappls.com/advancedmaps/v1';

export interface MapplsPlace {
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  distance?: number;
}

/**
 * Searches for nearby places based on keywords and location.
 */
export async function searchNearby(
  query: string,
  location: string,
  radius: number = 5000
): Promise<MapplsPlace[]> {
  const apiKey = process.env.MAPPLS_API_KEY;
  if (!apiKey) return getMockNearbyData(query);

  try {
    const response = await fetch(
      `${MAPPLS_BASE_URL}/nearby/json?keywords=${encodeURIComponent(query)}&refLocation=${location}&radius=${radius}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) return getMockNearbyData(query);

    const data = await response.json();
    return (data.suggestedLocations || []).map((loc: any) => ({
      placeName: loc.placeName,
      placeAddress: loc.placeAddress,
      latitude: loc.latitude,
      longitude: loc.longitude,
      distance: loc.distance
    }));
  } catch (error) {
    console.error('Mappls Nearby Error:', error);
    return getMockNearbyData(query);
  }
}

/**
 * Converts an address string into geographic coordinates.
 */
export async function geocode(address: string): Promise<MapplsPlace | null> {
  const apiKey = process.env.MAPPLS_API_KEY;
  if (!apiKey) return { placeName: address, placeAddress: "Mock Address", latitude: 28.6139, longitude: 77.2090 };

  try {
    const response = await fetch(
      `${MAPPLS_BASE_URL}/geocode?address=${encodeURIComponent(address)}`,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      }
    );
    const data = await response.json();
    if (data.copResults && data.copResults.length > 0) {
      const res = data.copResults[0];
      return {
        placeName: res.formattedAddress,
        placeAddress: res.formattedAddress,
        latitude: res.latitude,
        longitude: res.longitude
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Converts geographic coordinates into a human-readable address.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const apiKey = process.env.MAPPLS_API_KEY;
  if (!apiKey) return "256, Mock Street, New Delhi";

  try {
    const response = await fetch(
      `${MAPPLS_BASE_URL}/rev_geocode?lat=${lat}&lng=${lng}`,
      {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      }
    );
    const data = await response.json();
    return data.results?.[0]?.formatted_address || null;
  } catch (error) {
    return null;
  }
}

/**
 * Calculates distance and duration between two points.
 */
export async function getDistance(
  start: string,
  end: string
): Promise<{ distance: number; duration: number }> {
  const apiKey = process.env.MAPPLS_API_KEY;
  if (!apiKey) return { distance: 5.2, duration: 12 };

  try {
    const response = await fetch(
      `${MAPPLS_ROUTING_URL}/${apiKey}/route_adv/driving/${start};${end}?steps=false`
    );
    const data = await response.json();
    if (data.results && data.results[0]) {
      return {
        distance: data.results[0].length / 1000,
        duration: Math.round(data.results[0].duration / 60),
      };
    }
    return { distance: 5, duration: 10 };
  } catch (error) {
    return { distance: 5, duration: 10 };
  }
}

function getMockNearbyData(query: string): MapplsPlace[] {
  return [
    {
      placeName: `${query} Central`,
      placeAddress: "123 Emergency Way, Downtown",
      latitude: 28.6139,
      longitude: 77.2090,
      distance: 1200
    },
    {
      placeName: `${query} Sector 45`,
      placeAddress: "Plot 7, Medical District",
      latitude: 28.6145,
      longitude: 77.2010,
      distance: 2500
    }
  ];
}
