'use server';
/**
 * @fileOverview This flow utilizes advanced Mappls tools to optimize emergency dispatch.
 * It uses Distance Matrix for selection, Routing for ETA, and Reverse Geocoding for address verification.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { 
  findNearbyPlaces, 
  getOptimalRoute, 
  getAddressFromCoords, 
  evaluateDispatchOptions 
} from '@/ai/tools/mappls-tools';

const SOSDispatchStatusInputSchema = z.object({
  emergencyType: z.string().optional().describe("e.g., 'Fire', 'Medical', 'Flood'"),
  userLocation: z.string().default("28.6139,77.2090").describe("User coordinates in 'lat,lng' format."),
});

const SOSDispatchStatusOutputSchema = z.object({
  nearestUnitAssigned: z.string().describe("The name of the closest emergency unit."),
  etaMinutes: z.number().describe("Estimated time of arrival in minutes."),
  dispatchAddress: z.string().describe("The human-readable address of the distress call."),
  hazardStatus: z.string().optional().describe("Any identified hazards at the location."),
  responderRouteId: z.string().optional().describe("Reference ID for the assigned route."),
});

export async function getAIDrivenDispatchStatus(input: z.infer<typeof SOSDispatchStatusInputSchema>) {
  return aiDrivenDispatchStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDrivenDispatchStatusPrompt',
  system: `You are a high-level Emergency Command AI. 
Your priority is accuracy and speed. You MUST use the provided tools to gather real-world data. 
Do not guess addresses or arrival times. 
Once you have used the tools to find the best unit and ETA, you MUST provide the final result in the requested JSON format.`,
  input: {schema: SOSDispatchStatusInputSchema},
  output: {schema: SOSDispatchStatusOutputSchema},
  tools: [findNearbyPlaces, getOptimalRoute, getAddressFromCoords, evaluateDispatchOptions],
  prompt: `A distress signal has been received.

Emergency Details:
- Type: {{emergencyType}}
- Coordinates: {{userLocation}}

MANDATORY PROTOCOL:
1. Confirm the street address by calling 'getAddressFromCoords' with the user location.
2. Search for the nearest relevant emergency units (e.g., "Hospital" for Medical, "Fire Station" for Fire) using 'findNearbyPlaces'.
3. Use 'evaluateDispatchOptions' (Distance Matrix) to compare travel times for the discovered units.
4. Select the fastest unit and call 'getOptimalRoute' to get a precise ETA.
5. Provide the final dispatch status in the required JSON schema.

Perform these steps now.`,
});

const aiDrivenDispatchStatusFlow = ai.defineFlow(
  {
    name: 'aiDrivenDispatchStatusFlow',
    inputSchema: SOSDispatchStatusInputSchema,
    outputSchema: SOSDispatchStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Emergency AI failed to generate a valid dispatch status.");
    }
    return output;
  }
);
