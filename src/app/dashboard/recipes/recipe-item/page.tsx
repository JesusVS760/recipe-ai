"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecipesSearch } from "@/hooks/useRecipesSearch";
import { Archive, Heart, Save } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast, Toaster } from "sonner";
import { useRecipeMutations } from "@/hooks/recipe-mutations";
import { parseInstructions } from "@/lib/utils";

export default function RecipeItem() {
  const [isActive, setIsActive] = useState(false);

  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");
  const { createRecipe } = useRecipeMutations();

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  const { getRecipe, loading, recipe } = useRecipesSearch();
  const received = recipe as any;

  useEffect(() => {
    if (recipeId) {
      getRecipe(recipeId);
    }
  }, [recipeId]);

  async function handleFavorite() {
    // const difficultyLabel = received.difficulty;
    try {
      const recipeData = {
        title: received.title,
        ingredients: received.extendedIngredients,
        instructions: parseInstructions(received.instructions),
        prepTime: received.preparationMinutes || 0,
        cookTime: received.cookingMinutes || 0,
        servings: received.servings,
        imageUrl: received.image,
        difficulty: "medium", //  hardcode or make it simple
        dietaryTags: received.diets || [],
        user: {
          connect: {
            id: "cmd3qtyz20000vqp036coyf9h", // Your actual user ID
          },
        },
      };
      await createRecipe.mutateAsync(recipeData);
      setIsActive(!isActive);
      toast("Successfully favorited ✔️!");
    } catch (error) {
      console.log("Error Favoriting");
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="flex items-center justify-center">
      <Toaster />
      <div className=" max-w-[1400px] flex flex-row items-center justify-center bg-gray-100 p-10 rounded-lg border-gray-200 outline-2">
        <img
          className="rounded-2xl outline-2"
          src={received.image}
          alt={received.title}
        />
        <div className="flex flex-col items-start justify-center gap-2 p-4">
          <div className="flex items-center ">
            <div>
              <h3 className="font-bold text-3xl">{received.title}</h3>
            </div>
            <div className="flex items-center pl-2 gap-2">
              <div className="flex items-center ">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">Favorite</Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between gap-4">
                      <Avatar>
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          Add to Recipes
                        </h4>
                        <p className="text-sm">
                          Favorite this recipe for later use!
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <div
                  onClick={handleFavorite}
                  className="cursor-pointer transition-colors duration-200"
                >
                  <Heart
                    className={
                      isActive ? "fill-red-500 text-red-500" : "fill-none"
                    }
                  />
                </div>
              </div>
              <div>
                <Save size={24} />
              </div>
              <div>
                <Archive size={24} />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-xl">Description:</h3>
            <div>{stripHtmlTags(received.summary)}</div>
          </div>
        </div>
      </div>

      {/* OPEN AI INTERGRATION  */}
    </div>
  );
}
