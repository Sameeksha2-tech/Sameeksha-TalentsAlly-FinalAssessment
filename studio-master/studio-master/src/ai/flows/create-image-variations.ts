// src/ai/flows/create-image-variations.ts
'use server';

/**
 * @fileOverview Generates variations of a base image using AI.
 *
 * - createImageVariations - A function that handles the image variation generation process.
 * - CreateImageVariationsInput - The input type for the createImageVariations function.
 * - CreateImageVariationsOutput - The return type for the createImageVariations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateImageVariationsInputSchema = z.object({
  baseImageDataUri: z
    .string()
    .describe(
      "A base image to use for creating variations, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  prompt: z.string().describe('A text prompt to guide the image variation.'),
});
export type CreateImageVariationsInput = z.infer<typeof CreateImageVariationsInputSchema>;

const CreateImageVariationsOutputSchema = z.object({
  variedImageDataUri: z
    .string()
    .describe(
      'The data URI of the generated image variation, which includes a MIME type and uses Base64 encoding.'
    ),
});
export type CreateImageVariationsOutput = z.infer<typeof CreateImageVariationsOutputSchema>;

export async function createImageVariations(input: CreateImageVariationsInput): Promise<CreateImageVariationsOutput> {
  return createImageVariationsFlow(input);
}

const createImageVariationsPrompt = ai.definePrompt({
  name: 'createImageVariationsPrompt',
  input: {schema: CreateImageVariationsInputSchema},
  output: {schema: CreateImageVariationsOutputSchema},
  prompt: [
    {media: {url: '{{{baseImageDataUri}}}'}},
    {text: 'Generate an image variation of this image based on the following prompt: {{{prompt}}}.'},
  ],
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
});

const createImageVariationsFlow = ai.defineFlow(
  {
    name: 'createImageVariationsFlow',
    inputSchema: CreateImageVariationsInputSchema,
    outputSchema: CreateImageVariationsOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: createImageVariationsPrompt,
      promptParams: input,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {variedImageDataUri: media!.url!};
  }
);
