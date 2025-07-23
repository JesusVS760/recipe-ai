import { useQuery } from "@tanstack/react-query";

export const useSavedRecipes = () => {
  return useQuery({
    queryKey: ["savedRecipes"],
    queryFn: async () => {
      const response = await fetch(`/api/recipes`);
      if (!response) {
        throw new Error("Failed to fetch saved recipes");
      }
      const data = await response.json();
      return data.recipes;
    },
  });
};
