import { ImageSystemPrompt, openai } from "@/lib/openai";

export const imageGenerationService = {
  async generateImage(data: any) {
    try {
      const prompt = `${ImageSystemPrompt}, RECIPE DATA: ${data}`;

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      if (!response.data || response.data.length === 0) {
        console.log("No image data received");
        return "";
      }

      const imageBase64 = response.data[0].b64_json;

      if (imageBase64) {
        const fs = await import("fs");
        fs.writeFileSync(
          "generated_image.png",
          Buffer.from(imageBase64, "base64")
        );
      }

      return imageBase64;
    } catch (error) {
      console.log("Error generating image:", error);
      return "";
    }
  },
};
