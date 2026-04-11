'use server';
/**
 * @fileOverview A general-purpose location assistant that uses Mappls tools 
 * to answer questions about places, distances, and directions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findNearbyPlaces, calculateTravelInfo, geocodeAddress, reverseGeocodeCoords } from '@/ai/tools/mappls-tools';

const LocationAssistantInputSchema = z.object({
  userPrompt: z.string().describe('The user question about a location, distance, or search.'),
  currentContext: z.string().optional().describe('Any context like current user location if available.'),
});
export type LocationAssistantInput = z.infer<typeof LocationAssistantInputSchema>;

const LocationAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI response to the user query.'),
  data: z.any().optional().describe('Structured data returned by tools if applicable.'),
});
export type LocationAssistantOutput = z.infer<typeof LocationAssistantOutputSchema>;

export async function askLocationAssistant(input: LocationAssistantInput): Promise<LocationAssistantOutput> {
  return locationAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'locationAssistantPrompt',
  input: {schema: LocationAssistantInputSchema},
  output: {schema: LocationAssistantOutputSchema},
  tools: [findNearbyPlaces, calculateTravelInfo, geocodeAddress, reverseGeocodeCoords],
  prompt: `You are a helpful location assistant powered by Mappls Maps. 
  
  Use the provided tools to answer user questions about locations, searching for places, finding distances, or identifying addresses.
  
  User Prompt: {{{userPrompt}}}
  Context: {{{currentContext}}}
  
  If the user asks for a search, use 'findNearbyPlaces'. 
  If they ask how far something is, use 'calculateTravelInfo' (you might need to geocode addresses first if they provide names instead of coords).
  If they give coordinates, use 'reverseGeocodeCoords' to tell them where they are.
  
  Always provide a friendly and helpful summary in your answer.`,
});

const locationAssistantFlow = ai.defineFlow(
  {
    name: 'locationAssistantFlow',
    inputSchema: LocationAssistantInputSchema,
    outputSchema: LocationAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
