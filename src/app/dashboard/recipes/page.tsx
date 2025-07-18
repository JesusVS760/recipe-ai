"use client";

import { useEffect, useState } from "react";
import SearchRecipes from "./SearchRecipes";
import RecipeCard from "./recipe-card";

export default function RecipesPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [defaultRecipes, setDefaultRecipes] = useState([]);

  // Load default recipes on component mount
  useEffect(() => {
    loadDefaultRecipes();
  }, []);

  const loadDefaultRecipes = async () => {
    // This could be:
    // - User's saved recipes
    // - Featured recipes
    // - Recently viewed recipes
    // - Popular recipes
    try {
      // Example: Load from API or local storage
      const savedRecipes = localStorage.getItem("favoriteRecipes");
      if (savedRecipes) {
        setDefaultRecipes(JSON.parse(savedRecipes));
      }
    } catch (error) {
      console.error("Error loading default recipes:", error);
    }
  };

  const displayedRecipes = isSearching ? searchResults : defaultRecipes;
  const title = isSearching ? "Search Results" : "Your Recipes";

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {displayedRecipes.length > 0 ? (
        <RecipeCard recipeData={displayedRecipes} />
      ) : (
        <div className="text-gray-500 text-center py-8">
          {isSearching
            ? "No recipes found. Try a different search."
            : "No recipes yet. Search for some recipes to get started!"}
        </div>
      )}
    </div>
  );
}
