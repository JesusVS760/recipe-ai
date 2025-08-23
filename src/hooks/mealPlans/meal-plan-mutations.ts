import { Prisma } from "@prisma/client";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

export const useMealPlanMutations = () => {
  const queryClient = useQueryClient();

  const createMealPlan = useMutation({
    mutationFn: async (mealPlanData: any) => {
      const { data } = await axios.post("/api/mealPlans", mealPlanData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });

  const updateMealPlan = useMutation({
    mutationFn: async ({
      id,
      data: mealPlanData,
    }: {
      id: string;
      data: Prisma.MealPlanCreateInput;
    }) => {
      const { data } = await axios.patch(`/api/mealPlans/${id}`, mealPlanData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
      queryClient.invalidateQueries({ queryKey: ["mealPlans", variables.id] });
    },
  });

  const deleteMealPlan = useMutation({
    mutationFn: async (mealPlanId: string) => {
      const { data } = await axios.delete(`/api/mealPlans/${mealPlanId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });

  return { createMealPlan, updateMealPlan, deleteMealPlan };
};
