// hooks/useRecipeQueries.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useRecipeQueries = () => {
  const getRecipes = () =>
    useQuery({
      queryKey: ["recipes"],
      queryFn: async () => {
        const { data } = await axios.get("/api/recipes");
        console.log("recipes", data);
        return data;
      },
    });

  return { getRecipes };
};
