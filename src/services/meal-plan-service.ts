import { prisma } from "@/lib/prisma";

export const mealPlanService = {
  getMealPlan: async (userId: string) => {
    if (!userId) {
      return [];
    }
    return prisma.mealPlan.findMany({ where: { userId: userId } });
  },

  updateMealPlan: async (mealPlanId: string, data: any) => {
    if (!mealPlanId || !data) {
      throw new Error("No meal plan id or data");
    }
    return prisma.mealPlan.update({
      data,
      where: {
        id: mealPlanId,
      },
    });
  },

  deleteMealPlan: async (mealPlanId: string) => {
    if (!mealPlanId) {
      throw new Error("No meal plan Id");
    }
    return prisma.mealPlan.delete({
      where: {
        id: mealPlanId,
      },
    });
  },
};
