import axios from "axios";
import { useState } from "react";

export function useRecipeSearch() {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

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

  return { searchRecipes, loading, recipes };
}
