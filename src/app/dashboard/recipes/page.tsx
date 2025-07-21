"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRecipesSearch } from "@/hooks/useRecipesSearch";
import RecipeCard from "../../../features/recipes/components/recipe-card";

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const { loading, recipes, searchRecipes } = useRecipesSearch();
  const [defaultRecipes, setDefaultRecipes] = useState([]);
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      // Perform search if there's a search query in URL
      setIsSearching(true);
      performSearch(searchQuery);
    } else {
      // Load default recipes
      loadDefaultRecipes();
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Update current recipes when search results change
    if (isSearching) {
      setCurrentRecipes(recipes);
    } else {
      setCurrentRecipes(defaultRecipes);
    }
  }, [recipes, defaultRecipes, isSearching]);

  const performSearch = async (query: any) => {
    await searchRecipes(query);
  };

  const loadDefaultRecipes = async () => {
    try {
      const savedRecipes = localStorage.getItem("favoriteRecipes");
      if (savedRecipes) {
        setDefaultRecipes(JSON.parse(savedRecipes));
      }
    } catch (error) {
      console.error("Error loading default recipes:", error);
    }
  };

  const title = isSearching
    ? `Search Results for "${searchQuery}"`
    : "Your Recipes";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {currentRecipes.length > 0 ? (
          <RecipeCard recipeData={currentRecipes} />
        ) : (
          <div className="text-gray-500 text-center py-8">
            {isSearching
              ? "No recipes found. Try a different search."
              : "No recipes yet. Search for some recipes to get started!"}
          </div>
        )}
      </div>
    </div>
  );
}
