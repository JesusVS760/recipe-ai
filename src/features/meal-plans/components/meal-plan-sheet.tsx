"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const mealPlanSchema = z.object({});

type mealPlanData = z.infer<typeof mealPlanSchema>;

export default function MealPlanSheet() {
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, isLoading },
  } = useForm<mealPlanData>({
    resolver: zodResolver(mealPlanSchema),
    mode: "onChange",
  });

  async function onSubmit(data: mealPlanData) {
    setLoading(false);
    setError(null);

    try {
    } catch (error) {
      setError("An unexpected error as occurred, please try again!");
    }
  }
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          className="bg-gray-600 text-white p-2 px-4 rounded-md font-semibold"
          onClick={() => setIsOpen(true)}
        >
          Create Meal Plan
        </SheetTrigger>
        <SheetContent className="w-full h-full max-w-none p-0 bg-white">
          <SheetHeader>
            <SheetTitle>Meal Plan Creation</SheetTitle>
            <SheetDescription>
              <SheetTitle>Meal Plan Creation</SheetTitle>
              <SheetDescription>
                Transform your weekly cooking from chaos to organized. Generate
                custom meal plans that save time, reduce food waste, and keep
                your nutrition on track
              </SheetDescription>
            </SheetDescription>
          </SheetHeader>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div></div>
            <div></div>
            <div></div>
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
