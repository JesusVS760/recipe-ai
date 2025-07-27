"use client";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRecipesSearch } from "@/hooks/useRecipesSearch";
import RecipeCard from "../../../features/recipes/components/recipe-card";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import SavedRecipeCard from "@/features/recipes/components/saved-recipe-card";
import { RecipeSheet } from "@/features/recipes/components/recipe-sheet";

export default function RecipesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  const { loading, recipes, searchRecipes } = useRecipesSearch();
  const { data: savedRecipes = [], isLoading: savedRecipesLoading } =
    useSavedRecipes();

  const [isSearching, setIsSearching] = useState(false);

  // Memoize the current recipes to prevent unnecessary re-renders
  const searchResults = useMemo(() => {
    return isSearching ? recipes : [];
  }, [isSearching, recipes]);

  const savedOnlyRecipes = useMemo(() => {
    return savedRecipes;
  }, [savedRecipes]);

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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
          </div>
          <div>
            <RecipeSheet />
          </div>
        </div>
        {isSearching ? (
          searchResults.length > 0 ? (
            <RecipeCard recipeData={searchResults} />
          ) : (
            <div className="text-gray-500 text-center py-8">
              No recipes found. Try a different search.
            </div>
          )
        ) : savedOnlyRecipes.length > 0 ? (
          <SavedRecipeCard recipeData={savedOnlyRecipes} />
        ) : (
          <div className="text-gray-500 text-center py-8">
            No recipes yet. Search for some recipes to get started!
          </div>
        )}
      </div>
    </div>
  );
}
