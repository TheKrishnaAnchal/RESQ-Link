'use server';
/**
 * @fileOverview This flow simulates an AI-driven dispatch status for an SOS activation.
 * It returns mock data for the nearest unit assigned and an estimated time of arrival (ETA).
 *
 * - getAIDrivenDispatchStatus - A function that triggers the AI-driven dispatch status generation.
 * - SOSDispatchStatusInput - The input type for the getAIDrivenDispatchStatus function.
 * - SOSDispatchStatusOutput - The return type for the getAIDrivenDispatchStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SOSDispatchStatusInputSchema = z
  .object({
    emergencyType: z
      .string()
      .optional()
      .describe("The type of emergency, e.g., 'Fire', 'Medical', 'Flood'."),
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
  prompt: `You are an emergency dispatch AI.

Generate a mock dispatch status for an emergency. Based on the emergency type (if provided), assign a plausible nearest unit and a realistic estimated time of arrival.

If emergencyType is provided, tailor the unit and ETA accordingly. Otherwise, use a generic response.

Examples:
- Input: { emergencyType: "Medical" } Output: { "nearestUnitAssigned": "Ambulance Unit 7", "etaMinutes": 8 }
- Input: { emergencyType: "Fire" } Output: { "nearestUnitAssigned": "Fire Engine 202", "etaMinutes": 12 }
- Input: { emergencyType: "Flood" } Output: { "nearestUnitAssigned": "Rescue Boat Team Gamma", "etaMinutes": 25 }
- Input: {} Output: { "nearestUnitAssigned": "Patrol Unit Alpha", "etaMinutes": 10 }

Emergency Type: {{{emergencyType}}}`,
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
