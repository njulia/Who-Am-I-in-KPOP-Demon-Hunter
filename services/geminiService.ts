import { GoogleGenAI, Modality } from "@google/genai";
import { CHARACTERS } from '../constants';
import type { GenerationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function fileToGenerativePart(file: File) {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("File could not be read as a string."));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function generateCharacterOutfit(imageFile: File): Promise<GenerationResult> {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }

  const imagePart = await fileToGenerativePart(imageFile);

  const characterDescriptions = CHARACTERS.map(c => 
    `- **${c.name}**: ${c.description} Her style is ${c.style.toLowerCase()}.`
  ).join('\n');

  const prompt = `You are a fashion AI stylist. A user has provided their photo. Your task is to match them with one of three K-pop demon hunter characters and then redraw the user in the matched character's outfit.

Here are the character descriptions:
${characterDescriptions}

Instructions:
1. Analyze the user's photo to understand their pose and general vibe.
2. Based on this analysis, decide which character (Rumi, Mira, or Zoey) is the best style match.
3. Edit the user's photo to replace their clothes with the full outfit of the *matched* character.
4. **Crucially, preserve the user's original face, hair, and body shape as much as possible.** Only change the clothing.
5. In the text response, state *only* the name of the character you chose. For example: "Rumi". Do not add any other words, explanation, or punctuation.

Your output must have two parts: the edited image and a short text part with just the character's name.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let generatedImage: string | null = null;
    let matchedCharacter: string = 'Unknown';

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        matchedCharacter = part.text.trim();
      } else if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        generatedImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    if (!generatedImage) {
      throw new Error("The AI did not return an image. Please try again.");
    }
    
    // Fallback if character name is not found in text part
    if (matchedCharacter === 'Unknown') {
        const fallbackName = CHARACTERS.find(c => response.text.includes(c.name))?.name;
        matchedCharacter = fallbackName || 'Character';
    }


    return {
      imageUrl: generatedImage,
      characterName: matchedCharacter,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate character outfit. Please check your API key and try again.");
  }
}
