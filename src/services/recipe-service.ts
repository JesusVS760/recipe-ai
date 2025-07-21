import { prisma } from "@/lib/prisma";
import { Prisma, Recipe } from "@prisma/client";

export const recipeService = {
  createRecipe: async (data: any) => {
    return await prisma.recipe.create({ data });
  },
  getRecipes: async (userId: string) => {
    if (!userId) {
      return [];
    }
    return await prisma.recipe.findMany({
      orderBy: {
        difficulty: "asc",
      },
      where: {
        userId: userId,
      },
    });
  },

  getRecipeById: async (recipeId: string) => {
    if (!recipeId) return null;
    return await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });
  },

  updateRecipe: async (recipeId: string, data: Prisma.RecipeUpdateInput) => {
    if (!recipeId || !data) {
      throw new Error("No recipe id or data");
    }
    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data,
    });

    if (!updatedRecipe) {
      throw new Error("Failed to update recipe");
    }
    return updatedRecipe;
  },

  deleteRecipe: async (recipeId: string) => {
    if (!recipeId) throw new Error("No recipe id!");
    return await prisma.recipe.delete({
      where: { id: recipeId },
    });
  },

  deleteRecipes: async () => {
    return await prisma.recipe.deleteMany({});
  },
};
