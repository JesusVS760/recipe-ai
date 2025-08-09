import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

const uploadImage = async (file: File): Promise<string> => {
  throw new Error("Image upload not implemented");
};

const analyzeIngredientImage = async (imageUrl: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
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
                "calories": number,
                "protein": number,
                "carbs": number,
                "fat": number,
                "fiber": number,
                "servingSize": "100g"
              }
            }`,
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
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
  createIngredient: async (data: {
    imageFile?: File;
    imageUrl?: string;
    userId: string;
    [key: string]: any;
  }) => {
    try {
      let imageUrl = data.imageUrl;

      if (data.imageFile) {
        imageUrl = await uploadImage(data.imageFile);
      }

      if (!imageUrl) {
        throw new Error("No image URL available for analysis");
      }

      const analysis = await analyzeIngredientImage(imageUrl);

      const ingredientData = {
        userId: data.userId,
        imageUrl,
        ingredients: analysis.ingredients,
        nutrition: analysis.nutrition,
        isAiGenerated: true,
        analysisStatus: "completed",
        ...Object.fromEntries(
          Object.entries(data).filter(
            ([key]) => !["imageFile", "imageUrl", "userId"].includes(key)
          )
        ),
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
      await prisma.ingredientAnalysis.create({
        data: {
          userId: data.userId,
          imageUrl: data.imageUrl || "",
          ingredients: {},
          nutrition: [],
          isAiGenerated: true,
          analysisStatus: "failed",
        },
      });

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
