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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import z from "zod";

const mealPlanSchema = z.object({
  name: z.string().min(1).max(16),
  startDate: z.date(),
  endDate: z.date(),
});

type mealPlanSheetData = z.infer<typeof mealPlanSchema>;

export default function MealPlanSheet() {
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { createMealPlan } = useMealPlanMutations();

  const {
    register,
    handleSubmit,
    formState: { isValid, isLoading, errors },
  } = useForm<mealPlanSheetData>({
    resolver: zodResolver(mealPlanSchema),
    mode: "onChange",
  });

  async function onSubmit(data: mealPlanSheetData) {
    setLoading(false);
    setError(null);

    try {
      const createMealResponse = await createMealPlan.mutateAsync(data);
      console.log(createMealResponse);
      ("Successfully created meal plan 🥗!");
    } catch (error) {
      toast("Failed to create meal plan, please try again!");
      setError("An unexpected error as occurred, please try again!");
    }
  }
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
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto max-h-screen">
          <SheetHeader>
            <SheetTitle>Meal Plan Creation</SheetTitle>
            <SheetDescription>
              Transform your weekly cooking from chaos to organized. Generate
              custom meal plans that save time, reduce food waste, and keep your
              nutrition on track
            </SheetDescription>
          </SheetHeader>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Recipe Title</label>
              <input
                {...register("name")}
                type="text"
                className="outline p-2 rounded-md border"
                placeholder="e.g Progressive weight loss"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Start Date</label>
              <input
                {...register("startDate")}
                type="date"
                className="border p-2 rounded"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Image</label>
              <input
                {...register("endDate")}
                type="date"
                className="border p-2 rounded"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.endDate.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 cursor-pointer px-4 border border-transparent bg-black rounded-lg shadow-sm text-sm font-medium text-white hover:bg-gray-800 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>{" "}
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
