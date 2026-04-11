'use server';
/**
 * @fileOverview This flow utilizes Mappls tools to find the nearest emergency unit 
 * and provide a realistic dispatch status for an SOS activation.
 *
 * - getAIDrivenDispatchStatus - A function that triggers the AI-driven dispatch process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findNearbyEmergencyServices, calculateTravelInfo } from '@/ai/tools/mappls-tools';

const SOSDispatchStatusInputSchema = z
  .object({
    emergencyType: z
      .string()
      .optional()
      .describe("The type of emergency, e.g., 'Fire', 'Medical', 'Flood'."),
    userLocation: z
      .string()
      .default("28.6139,77.2090")
      .describe("The user's current GPS coordinates as 'lat,lng'."),
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
  tools: [findNearbyEmergencyServices, calculateTravelInfo],
  prompt: `You are an emergency dispatch AI. 

The user has activated an SOS for a {{emergencyType}} emergency at coordinates {{userLocation}}.

Your task:
1. Use 'findNearbyEmergencyServices' to find appropriate units (e.g., search for "Hospital" if Medical, "Fire Station" if Fire).
2. Once you find the nearest unit, use 'calculateTravelInfo' to determine the travel time from that unit's location to the user.
3. Return the results as a structured dispatch status.

Be precise. If no specific type is provided, default to searching for "Police Station".`,
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
