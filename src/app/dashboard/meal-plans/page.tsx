"use client";
import MealPlanSheet from "@/features/meal-plans/components/meal-plan-sheet";
import MealPlanCard from "@/hooks/mealPlans/meal-plan-card";
import { useMealPlans } from "@/hooks/mealPlans/useMealPlans";
import { useMemo, useState } from "react";

export default function MealPlanPage() {
  const [isSearching, setIsSearching] = useState(false);
  const { data: mealPlans, isLoading, isError } = useMealPlans();

  const savedMealPlans = useMemo(() => {
    return mealPlans || [];
  }, [mealPlans]);

  console.log("Meal Plans", mealPlans);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex gap-4">
          <MealPlanSheet />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Meal Plans</h2>
      </div>

      {isLoading ? (
        <div className="text-gray-500 text-center py-8">Loading...</div>
      ) : isError ? (
        <div className="text-red-500 text-center py-8">
          Failed to load meal plans.
        </div>
      ) : savedMealPlans.length > 0 ? (
        <MealPlanCard mealPlanData={savedMealPlans} />
      ) : (
        <div className="text-gray-500 text-center py-8">
          No Meal Plans yet. Search for some recipes to get started!
        </div>
      )}
    </div>
  );
}
