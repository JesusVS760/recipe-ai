import config from "@/config";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const ImageSystemPrompt = `Create a high-quality, realistic food photograph of a completed dish titled "{title}". This dish is categorized as {cuisine} cuisine, with a difficulty level of {difficulty}. It serves {servings} people and takes approximately {prepTime + cookTime} minutes total to prepare.
The recipe includes ingredients such as: {top 3–5 ingredients with quantities}.
The dish adheres to the following dietary tags: {dietaryTags}.
Display the dish plated attractively on a clean background that complements the cuisine (e.g., rustic for Italian, minimalist for Japanese).
The image should be well-lit, vibrant, and styled like a professional food blog or cookbook cover.
(Optional: Include light garnish or props like utensils or side dishes for context, but keep focus on the main dish.)`;
