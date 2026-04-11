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
  emergencyType: z.string().optional().describe("e.g., 'Fire', 'Medical'"),
  userLocation: z.string().default("28.6139,77.2090"),
});

const SOSDispatchStatusOutputSchema = z.object({
  nearestUnitAssigned: z.string(),
  etaMinutes: z.number(),
  dispatchAddress: z.string(),
  hazardStatus: z.string().optional(),
  responderRouteId: z.string().optional(),
});

export async function getAIDrivenDispatchStatus(input: z.infer<typeof SOSDispatchStatusInputSchema>) {
  return aiDrivenDispatchStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDrivenDispatchStatusPrompt',
  input: {schema: SOSDispatchStatusInputSchema},
  output: {schema: SOSDispatchStatusOutputSchema},
  tools: [findNearbyPlaces, getOptimalRoute, getAddressFromCoords, evaluateDispatchOptions],
  prompt: `You are a high-level Emergency Command AI.

A SOS has been received for a {{emergencyType}} at location {{userLocation}}.

Plan of Action:
1. Use 'getAddressFromCoords' to confirm the physical address of the distress call.
2. Use 'findNearbyPlaces' to locate the top 3 nearest units (e.g. Fire Stations if type is Fire).
3. Use 'evaluateDispatchOptions' (Distance Matrix) to compare travel times of these units to the user.
4. Once the fastest unit is selected, use 'getOptimalRoute' to get the final precise ETA and route geometry.
5. Provide a summary status to the user.

Ensure you act with extreme urgency. Return a structured JSON response.`,
});

const aiDrivenDispatchStatusFlow = ai.defineFlow(
  {
    name: 'aiDrivenDispatchStatusFlow',
    inputSchema: SOSDispatchStatusInputSchema,
    outputSchema: SOSDispatchStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
