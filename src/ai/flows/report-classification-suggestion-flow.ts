'use server';
/**
 * @fileOverview This file implements a Genkit flow that analyzes a free-text issue description
 * and suggests a classification and relevant keywords for emergency incident reporting.
 *
 * - reportClassificationSuggestion - A function that handles the incident classification suggestion process.
 * - ReportClassificationSuggestionInput - The input type for the reportClassificationSuggestion function.
 * - ReportClassificationSuggestionOutput - The return type for the reportClassificationSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReportClassificationSuggestionInputSchema = z.object({
  description: z.string().describe('The free-text description of the incident.'),
});
export type ReportClassificationSuggestionInput = z.infer<
  typeof ReportClassificationSuggestionInputSchema
>;

const ReportClassificationSuggestionOutputSchema = z.object({
  classification: z
    .string()
    .describe('A primary classification for the incident (e.g., "Medical Emergency", "Fire", "Road Accident", "Theft").'),
  keywords: z
    .array(z.string())
    .describe('A list of relevant keywords describing the incident.'),
});
export type ReportClassificationSuggestionOutput = z.infer<
  typeof ReportClassificationSuggestionOutputSchema
>;

export async function reportClassificationSuggestion(
  input: ReportClassificationSuggestionInput
): Promise<ReportClassificationSuggestionOutput> {
  return reportClassificationSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reportClassificationSuggestionPrompt',
  input: {schema: ReportClassificationSuggestionInputSchema},
  output: {schema: ReportClassificationSuggestionOutputSchema},
  prompt: `You are an expert in emergency incident classification. Your task is to analyze the provided free-text issue description and suggest a primary classification and a list of relevant keywords.

Issue Description: {{{description}}}

Provide the output in the specified JSON format.`,
});

const reportClassificationSuggestionFlow = ai.defineFlow(
  {
    name: 'reportClassificationSuggestionFlow',
    inputSchema: ReportClassificationSuggestionInputSchema,
    outputSchema: ReportClassificationSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
