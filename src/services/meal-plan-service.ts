import { prisma } from "@/lib/prisma";

export const mealPlanService = {
  createMealPlan: async (data: any) => {
    return await prisma.mealPlan.create({ data });
  },

  getMealPlans: async (userId: string) => {
    if (!userId) {
      return [];
    }
    return await prisma.mealPlan.findMany({ where: { userId: userId } });
  },

  updateMealPlan: async (mealPlanId: string, data: any) => {
    if (!mealPlanId || !data) {
      throw new Error("No meal plan id or data");
    }
    return await prisma.mealPlan.update({
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
    return await prisma.mealPlan.delete({
      where: {
        id: mealPlanId,
      },
    });
  },
};
