"use client";

import RecipeCard from "../../../features/recipes/components/recipe-card";
import { useRecipesSearch } from "@/hooks/useRecipesSearch";
import { useState } from "react";

export default function SearchRecipes() {
  const { loading, recipes, searchRecipes } = useRecipesSearch();
  const [searchQuery, setSearchQuery] = useState("");

  const searchForRecipe = () => {
    if (searchQuery.trim()) {
      searchRecipes(searchQuery);
    }
  };

  return (
    <div>
      <div className="flex items-center w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by receipts and more"
          className="w-full bg-transparent outline-none text-sm"
        />
        <button onClick={searchForRecipe}>Search</button>
        {loading && <p>Searching...</p>}
      </div>
      <div>
        <RecipeCard recipeData={recipes} />
      </div>
    </div>
  );
}
