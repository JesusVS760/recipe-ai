"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRecipesSearch } from "@/hooks/useRecipesSearch";
import RecipeCard from "../../../features/recipes/components/recipe-card";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const { loading, recipes, searchRecipes } = useRecipesSearch();
  const { data: savedRecipes = [], isLoading: savedRecipesLoading } =
    useSavedRecipes();

  const [isSearching, setIsSearching] = useState(false);

  // Memoize the current recipes to prevent unnecessary re-renders
  const currentRecipes = useMemo(() => {
    return isSearching ? recipes : savedRecipes;
  }, [isSearching, recipes, savedRecipes]);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      performSearch(searchQuery);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]); // Only depend on searchQuery

  const performSearch = async (query: any) => {
    await searchRecipes(query);
  };

  const title = isSearching
    ? `Search Results for "${searchQuery}"`
    : "Your Recipes";

  if (loading || (!isSearching && savedRecipesLoading)) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>{isSearching ? "Searching..." : "Loading your recipes..."}</p>
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
