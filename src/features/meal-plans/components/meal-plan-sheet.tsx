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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import z from "zod";

const mealPlanFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(16, "Name must be 16 characters or less"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  });

const mealPlanApiSchema = z.object({
  name: z.string().min(1).max(16),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid datetime format",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid datetime format",
  }),
});

type MealPlanFormData = z.infer<typeof mealPlanFormSchema>;
type MealPlanApiData = z.infer<typeof mealPlanApiSchema>;

export default function MealPlanSheet() {
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { createMealPlan } = useMealPlanMutations();

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<MealPlanFormData>({
    resolver: zodResolver(mealPlanFormSchema),
    mode: "onChange",
  });

  async function onSubmit(data: MealPlanFormData) {
    setLoading(true);
    setError(null);

    try {
      // Transform form data to API format
      const apiData: MealPlanApiData = {
        name: data.name,
        startDate: new Date(data.startDate + "T00:00:00.000Z").toISOString(),
        endDate: new Date(data.endDate + "T00:00:00.000Z").toISOString(),
      };

      const createMealResponse = await createMealPlan.mutateAsync(apiData);
      console.log(createMealResponse);
      await queryClient.invalidateQueries({ queryKey: ["mealPlans"] });

      toast("Successfully created meal plan 🥗!");
      setIsOpen(false);
      reset(); // Reset form after successful submission
    } catch (error) {
      toast("Failed to create meal plan, please try again!");
      setError("An unexpected error occurred, please try again!");
    } finally {
      setLoading(false);
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
              <label className="font-semibold">End Date</label>
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
              disabled={isSubmitting || loading}
              className="w-full flex justify-center py-3 cursor-pointer px-4 border border-transparent bg-black rounded-lg shadow-sm text-sm font-medium text-white hover:bg-gray-800 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || loading ? (
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
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
