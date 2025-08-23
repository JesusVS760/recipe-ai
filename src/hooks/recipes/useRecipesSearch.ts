import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export function useRecipesSearch() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState(null);

  const searchRecipes = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/recipes/search`, {
        params: { query },
      });
      setRecipes(response.data.results);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };
  const getRecipe = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      setRecipe(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { searchRecipes, getRecipe, loading, recipes, recipe };
}
