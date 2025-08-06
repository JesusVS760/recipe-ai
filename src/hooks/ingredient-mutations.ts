import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useIngredientMutations = () => {
  const queryClient = useQueryClient();

  const generateIngredients = useMutation({
    mutationFn: async (data: any) => {
      const result = axios.post("/api/...", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const updateIngredients = useMutation({
    mutationFn: async ({ id, ingData }: { id: string; ingData: any }) => {
      const { data } = await axios.patch(`/api/ingredients/${id}`, ingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const deleteIngredients = useMutation({
    mutationFn: async (ingredientseId: string) => {
      const { data } = await axios.delete(
        `/api/ingredients/delete/${ingredientseId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      queryClient.invalidateQueries({ queryKey: ["savedRecipes"] });
    },
  });

  return { generateIngredients, deleteIngredients, updateIngredients };
};
