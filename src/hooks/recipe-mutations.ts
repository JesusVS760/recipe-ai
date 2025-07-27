import { Prisma } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useRecipeMutations = () => {
  const queryClient = useQueryClient();

  const createRecipe = useMutation({
    mutationFn: async (recipeData: any) => {
      const { data } = await axios.post("/api/recipes", recipeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["savedRecipes"] });
    },
  });
  // fix update mutation later
  const updateRecipe = useMutation({
    mutationFn: async ({
      id,
      data: recipeData,
    }: {
      id: string;
      data: Prisma.RecipeCreateInput;
    }) => {
      const { data } = await axios.patch(`/api/recipes/${id}`, recipeData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipes", variables.id] });
    },
  });

  const deleteRecipe = useMutation({
    mutationFn: async (recipeId: string) => {
      const { data } = await axios.delete(`/api/recipes/delete/${recipeId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["savedRecipes"] });
    },
  });

  const deleteRecipes = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete("/api/recipes");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  return { createRecipe, deleteRecipe, deleteRecipes, updateRecipe };
};
