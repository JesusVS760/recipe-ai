"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIngredientMutations } from "@/hooks/ingredient-mutations";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ingredientSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Image is required" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Must be an image file",
    }),
});

type IngredientData = z.infer<typeof ingredientSchema>;

export default function IngredientPhotoAnalysis() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { generateIngredients } = useIngredientMutations();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<IngredientData>();

  async function onSubmit(data: IngredientData) {
    setError(null);
    setIsLoading(true);

    try {
      const ingredientData = await generateIngredients.mutateAsync(data.image);
      console.log("data", ingredientData);
    } catch (error) {
      console.error("Error generating image:", error);
      toast("Failed to generate recipe!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          className="bg-gray-600 text-white p-2 px-4 rounded-md font-semibold"
          onClick={() => setIsOpen(true)}
        >
          Ingredient Identification
        </SheetTrigger>
        <SheetContent className="w-full h-full max-w-none p-0 bg-white">
          <SheetHeader>
            <SheetTitle>Ingredient Photo Identification</SheetTitle>
            <SheetDescription>
              Upload or take a photo of an ingredient, and our AI will identify
              it, suggest recipes, and provide nutritional info.
            </SheetDescription>
          </SheetHeader>
          {/* CONTENT*/}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full flex flex-col justify-between"
          >
            {/* Uncomment when you want to add image upload  */}
            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Image</label>
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                className="border p-2 rounded"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className="p-4">
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
                    Identifying...
                  </>
                ) : (
                  "Identify"
                )}
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
