import { ImageSystemPrompt, openai } from "@/lib/openai";

export const imageGenerationService = {
  async generateImage(data: any) {
    try {
      const simplePrompt = `Create a high-quality food photo of ${data.title}. Make it look delicious and professionally plated.`;

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: simplePrompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      if (!response.data || response.data.length === 0) {
        console.log("No image data received");
        return "";
      }

      if (!response.data || response.data.length === 0) {
        console.log("Service: No image data received from OpenAI");
        return null;
      }

      const imageBase64 = response.data[0].b64_json;

      return imageBase64;
    } catch (error) {
      console.log("Error generating image:", error);
      return null;
    }
  },
};
