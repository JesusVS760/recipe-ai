import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const mealPlanService = {
  createMealPlan: async (data: any) => {
    const user = await getSession();

    return await prisma.mealPlan.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        items: {
          createMany: {
            data: data.items,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
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
