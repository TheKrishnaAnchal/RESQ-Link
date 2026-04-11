'use server';
/**
 * @fileOverview This flow utilizes Mappls tools to find the nearest emergency unit 
 * and provide a realistic dispatch status for an SOS activation.
 *
 * - getAIDrivenDispatchStatus - A function that triggers the AI-driven dispatch process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findNearbyEmergencyServices, calculateTravelInfo, geocodeAddress } from '@/ai/tools/mappls-tools';

const SOSDispatchStatusInputSchema = z
  .object({
    emergencyType: z
      .string()
      .optional()
      .describe("The type of emergency, e.g., 'Fire', 'Medical', 'Flood'."),
    userLocation: z
      .string()
      .describe("The user's location. Can be 'lat,lng' coordinates or a physical address."),
  })
  .describe('Input for generating AI-driven dispatch status.');
export type SOSDispatchStatusInput = z.infer<typeof SOSDispatchStatusInputSchema>;

const SOSDispatchStatusOutputSchema = z
  .object({
    nearestUnitAssigned: z
      .string()
      .describe('The name or identifier of the nearest emergency unit assigned.'),
    etaMinutes: z
      .number()
      .describe('The estimated time of arrival in minutes for the assigned unit.'),
    distanceKm: z
      .number()
      .optional()
      .describe('Distance in kilometers.'),
    address: z
      .string()
      .optional()
      .describe('Address of the assigned unit.'),
    log: z
      .array(z.string())
      .optional()
      .describe('Step-by-step reasoning log of the dispatch decisions.'),
  })
  .describe('Output containing AI-driven dispatch status information.');
export type SOSDispatchStatusOutput = z.infer<typeof SOSDispatchStatusOutputSchema>;

export async function getAIDrivenDispatchStatus(
  input: SOSDispatchStatusInput
): Promise<SOSDispatchStatusOutput> {
  return aiDrivenDispatchStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDrivenDispatchStatusPrompt',
  input: {schema: SOSDispatchStatusInputSchema},
  output: {schema: SOSDispatchStatusOutputSchema},
  tools: [findNearbyEmergencyServices, calculateTravelInfo, geocodeAddress],
  prompt: `You are an emergency dispatch AI. 

The user has activated an SOS for a {{emergencyType}} emergency at location "{{userLocation}}".

Your protocol:
1. Determine if the location is coordinates (lat,lng) or an address. If it's an address, use 'geocodeAddress' to get coordinates.
2. Use 'findNearbyEmergencyServices' with the coordinates to find the closest appropriate units (Hospitals for Medical, Fire Stations for Fire, Police for others).
3. Select the single nearest unit.
4. Use 'calculateTravelInfo' to get the real-time ETA from that unit's location to the user.
5. Return the results as a structured dispatch status.

Always prioritize speed and accuracy. Include a brief log of the tools you used in the 'log' field.`,
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
