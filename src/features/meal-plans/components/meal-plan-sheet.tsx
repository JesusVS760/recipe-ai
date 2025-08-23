"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMealPlanMutations } from "@/hooks/mealPlans/meal-plan-mutations";
import { useRecipeQueries } from "@/hooks/recipes/useRecipesQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast, Toaster } from "sonner";
import z from "zod";

// Single schema for the form
const mealPlanSchema = z.object({
  name: z.string().min(1, "Name is required").max(16, "Name too long"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  items: z
    .array(
      z.object({
        recipeId: z.string().min(1, "Recipe is required"),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
        scheduledFor: z.string().min(1, "Date is required"),
        servings: z.number().min(1, "Must be at least 1").default(1),
      })
    )
    .min(1, "Add at least one meal"),
});

type MealPlan = z.infer<typeof mealPlanSchema>;

export default function MealPlanSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createMealPlan } = useMealPlanMutations();
  const { getRecipes } = useRecipeQueries(); // Add this
  const recipesQuery = getRecipes(); // Get the query
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      items: [
        { recipeId: "", mealType: "breakfast", scheduledFor: "", servings: 1 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: MealPlan) => {
    setLoading(true);
    try {
      await createMealPlan.mutateAsync({
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        items: data.items.map((item) => ({
          ...item,
          scheduledFor: new Date(item.scheduledFor).toISOString(),
        })),
      });

      await queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
      toast("Meal plan created! 🥗");
      setIsOpen(false);
      form.reset();
    } catch {
      toast("Failed to create meal plan");
    } finally {
      setLoading(false);
    }
  };

  const addMeal = () => {
    append({
      recipeId: "",
      mealType: "breakfast",
      scheduledFor: "",
      servings: 1,
    });
  };

  const recipes = recipesQuery.data?.recipes;
  const recipesLoading = recipesQuery.isLoading;
  const recipesError = recipesQuery.error;

  const mealTypes = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" },
  ];

  return (
    <div>
      <Toaster />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          className="bg-gray-600 text-white p-2 px-4 rounded-md font-semibold"
          onClick={() => setIsOpen(true)}
        >
          Create Meal Plan
        </SheetTrigger>

        <SheetContent className="w-[400px] sm:w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Meal Plan</SheetTitle>
            <SheetDescription>
              Plan your meals for the week ahead
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
            className="space-y-6 mt-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="p-4">
                <label className="block font-medium mb-2 ">Plan Name</label>
                <input
                  {...form.register("name")}
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="My Weekly Plan"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 p-4 gap-4">
                <div>
                  <label className="block font-medium mb-2">Start Date</label>
                  <input
                    {...form.register("startDate")}
                    type="date"
                    className="w-full border p-2 rounded"
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-2">End Date</label>
                  <input
                    {...form.register("endDate")}
                    type="date"
                    className="w-full border p-2 rounded"
                  />
                  {form.formState.errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Meals */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Meals</h3>
                <button
                  type="button"
                  onClick={addMeal}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Add Meal
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Meal {index + 1}</span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Recipe
                        </label>
                        <select
                          {...form.register(`items.${index}.recipeId`)}
                          className="w-full border p-2 rounded text-sm"
                          disabled={recipesLoading}
                        >
                          <option value="">
                            {recipesLoading
                              ? "Loading recipes..."
                              : "Choose recipe"}
                          </option>
                          {recipes.map((recipe: any) => (
                            <option key={recipe.id} value={recipe.id}>
                              {recipe.title}
                            </option>
                          ))}
                        </select>
                        {recipesError && (
                          <p className="text-red-500 text-xs mt-1">
                            Error loading recipes
                          </p>
                        )}
                        {form.formState.errors.items?.[index]?.recipeId && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              form.formState.errors.items[index]?.recipeId
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Type
                        </label>
                        <select
                          {...form.register(`items.${index}.mealType`)}
                          className="w-full border p-2 rounded text-sm"
                        >
                          {mealTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Date
                        </label>
                        <input
                          {...form.register(`items.${index}.scheduledFor`)}
                          type="date"
                          className="w-full border p-2 rounded text-sm"
                        />
                        {form.formState.errors.items?.[index]?.scheduledFor && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              form.formState.errors.items[index]?.scheduledFor
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Servings
                        </label>
                        <input
                          {...form.register(`items.${index}.servings`, {
                            valueAsNumber: true,
                          })}
                          type="number"
                          min="1"
                          className="w-full border p-2 rounded text-sm"
                        />
                        {form.formState.errors.items?.[index]?.servings && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              form.formState.errors.items[index]?.servings
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || form.formState.isSubmitting}
              className="w-full bg-black text-white py-3 cursor-pointer rounded font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Meal Plan"}
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
