import { prisma } from "@/lib/prisma";

export const ingredientService = {
  getIngredients: async (userId: string) => {
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
};
