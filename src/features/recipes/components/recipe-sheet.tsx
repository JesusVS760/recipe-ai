"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useImageGenerationMutations } from "@/hooks/imageGeneration/image-generation-mutations";
import { useRecipeMutations } from "@/hooks/recipes/recipe-mutations";
import { imageGenerationService } from "@/services/image-generation-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast, Toaster } from "sonner";
import z from "zod";

// Create enum that matches your Prisma enum
const RecipeDifficulty = z.enum(["high", "medium", "low"]);

const RecipeSheetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Image is required" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Must be an image file",
    })
    .optional(),
  difficulty: RecipeDifficulty,
  ingredients: z.string().min(1, "Ingredients are required"),
  instructions: z.string().min(1, "Instructions are required"),
  prepTime: z.number().min(1, "Prep time must be at least 1 minute"),
  cookTime: z.number().min(1, "Cook time must be at least 1 minute"),
  servings: z.number().min(1, "Servings must be at least 1"),
});

type FormRecipeSheetData = z.infer<typeof RecipeSheetSchema>;

export function RecipeSheet() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { createRecipe } = useRecipeMutations();
  const { createImage } = useImageGenerationMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    reset,
  } = useForm<FormRecipeSheetData>({
    resolver: zodResolver(RecipeSheetSchema),
    mode: "onChange",
  });

  async function onSubmit(data: FormRecipeSheetData) {
    console.log("Processing submission with data:", data);
    setError(null);
    setIsLoading(true);

    let imageUrl: string | File | undefined = data.image;

    try {
      const imageResponse = await createImage.mutateAsync(data);
      console.log("Image data: ", imageResponse.data);

      if (imageResponse?.data) {
        console.log("Image data: ", imageResponse.data);
        imageUrl = `data:image/png;base64,${imageResponse.data}`;
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast("Failed to generate image, proceeding without image");
    }

    try {
      const jsonData = {
        title: data.title,
        description: data.description || undefined,
        difficulty: data.difficulty,
        ingredients: data.ingredients,
        instructions: data.instructions
          .split("\n")
          .filter((line) => line.trim() !== ""),
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        imageUrl: imageUrl,
      };

      await createRecipe.mutateAsync(jsonData);

      toast("Successfully created recipe ✔️!");
      reset(); // Reset form after successful submission
      setIsOpen(false); // Close the sheet
    } catch (error) {
      console.error("Error creating recipe:", error);
      setError("An unexpected error occurred, try again!");
    } finally {
      setIsLoading(false);
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
          Create Recipe
        </SheetTrigger>

        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto max-h-screen">
          <SheetHeader>
            <SheetTitle>Create Custom Recipe!</SheetTitle>
            <SheetDescription>
              Create and save your favorite recipes with ingredients,
              instructions, and photos. Build your personal digital cookbook one
              recipe at a time
            </SheetDescription>
          </SheetHeader>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Recipe Title</label>
              <input
                {...register("title")}
                type="text"
                className="outline p-2 rounded-md border"
                placeholder="e.g Slow cooker braised steak and onions"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Description (Optional)</label>
              <textarea
                {...register("description")}
                className="outline p-2 rounded-md h-20 resize-none border"
                placeholder="Brief description of your recipe..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Difficulty</label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Ingredients</label>
              <textarea
                {...register("ingredients")}
                className="outline p-2 rounded-md h-32 resize-none border"
                placeholder="Enter ingredients here..."
              />
              {errors.ingredients && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ingredients.message}
                </p>
              )}
            </div>

            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Instructions</label>
              <textarea
                {...register("instructions")}
                className="outline p-2 rounded-md h-32 resize-none border"
                placeholder="Enter instructions here..."
              />
              {errors.instructions && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.instructions.message}
                </p>
              )}
            </div>

            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Prep Time (Minutes)</label>
              <input
                {...register("prepTime", { valueAsNumber: true })}
                type="number"
                className="outline p-2 rounded-md border"
                placeholder="e.g 10"
              />
              {errors.prepTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prepTime.message}
                </p>
              )}
            </div>

            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Cook Time (Minutes)</label>
              <input
                {...register("cookTime", { valueAsNumber: true })}
                type="number"
                className="outline p-2 rounded-md border"
                placeholder="e.g 25"
              />
              {errors.cookTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cookTime.message}
                </p>
              )}
            </div>

            <div className="flex flex-col p-4 gap-2">
              <label className="font-semibold">Servings</label>
              <input
                {...register("servings", { valueAsNumber: true })}
                type="number"
                className="outline p-2 rounded-md border"
                placeholder="e.g 4"
              />
              {errors.servings && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.servings.message}
                </p>
              )}
            </div>

            {/* Uncomment when you want to add image upload  */}
            {/* <div className="flex flex-col p-4 gap-2">
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
            </div> */}

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
                    Creating Recipe & Generating Image...
                  </>
                ) : (
                  "Create Recipe"
                )}
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
