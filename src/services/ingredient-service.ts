import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

const analyzeIngredientImage = async (base64Image: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // Updated model
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this ingredient image and return detailed information in JSON format with this structure:
            {
              "ingredients": [
                {
                  "name": "ingredient name",
                  "category": "food category",
                  "description": "brief description",
                  "commonUses": ["use1", "use2"],
                  "storageInstructions": "storage info",
                  "shelfLife": "shelf life info",
                  "healthBenefits": ["benefit1", "benefit2"]
                }
              ],
              "nutrition": {
                "calories": 100,
                "protein": 5,
                "carbs": 20,
                "fat": 2,
                "fiber": 3,
                "servingSize": "100g"
              }
            }`,
          },
          {
            type: "image_url",
            image_url: { url: base64Image },
          },
        ],
      },
    ],
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
};

export const ingredientService = {
  createIngredient: async (data: { base64Image: string; userId: string }) => {
    try {
      const analysis = await analyzeIngredientImage(data.base64Image);

      const ingredientData = {
        userId: data.userId,
        imageUrl: "", // No image URL since we're not storing the image
        ingredients: analysis.ingredients || [],
        nutrition: analysis.nutrition || {},
        isAiGenerated: true,
        analysisStatus: "completed",
      };

      const ingredient = await prisma.ingredientAnalysis.create({
        data: ingredientData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return ingredient;
    } catch (error) {
      console.error("Error in createIngredient:", error);

      // Create a failed analysis record
      try {
        await prisma.ingredientAnalysis.create({
          data: {
            userId: data.userId,
            imageUrl: "",
            ingredients: [],
            nutrition: {},
            isAiGenerated: true,
            analysisStatus: "failed",
          },
        });
      } catch (dbError) {
        console.error("Failed to create error record:", dbError);
      }

      if (error instanceof Error) {
        throw new Error(`Failed to create ingredient: ${error.message}`);
      }

      throw new Error("Failed to create ingredient: Unknown error");
    }
  },
  getIngredients: async (userId: string) => {
    if (!userId) {
      return [];
    }
    return await prisma.ingredientAnalysis.findMany({
      where: {
        userId: userId,
      },
    });
  },
  updateIngredient: async (ingredientId: string, data: any) => {
    if (!ingredientId || !data) {
      throw new Error("No ingredient id or data");
    }
    const updateIngredient = await prisma.ingredientAnalysis.update({
      data,
      where: {
        id: ingredientId,
      },
    });

    if (!updateIngredient) {
      throw new Error("Failed to update ingredient.");
    }

    return updateIngredient;
  },

  deleteIngredient: async (ingredientId: string) => {
    if (!ingredientId) {
      throw new Error("No ingredient Id");
    }

    return await prisma.ingredientAnalysis.delete({
      where: {
        id: ingredientId,
      },
    });
  },

  deleteIngredients: async () => {
    return await prisma.ingredientAnalysis.deleteMany({});
  },
};
