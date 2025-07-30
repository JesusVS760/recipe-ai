import config from "@/config";
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const ImageSystemPrompt = `Create a high-quality, realistic food photograph of a completed dish. Display the dish plated attractively on a clean background. The image should be well-lit, vibrant, and styled like a professional food blog or cookbook cover. Focus on making the food look appetizing and professionally presented with proper lighting and composition.`;
