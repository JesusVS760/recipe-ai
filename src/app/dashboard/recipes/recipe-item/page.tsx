"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecipesSearch } from "@/hooks/useRecipesSearch";
import { Archive, Heart, Save } from "lucide-react";

export default function RecipeItem() {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");

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

  if (loading) return <div>Loading...</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="grid grid-cols-2 items-center">
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md  cursor-pointer  shadow-xl border-1 border-gray-200">
        <img
          className="rounded-2xl outline-2"
          src={received.image}
          alt={received.title}
        />
        <div className="flex gap-2 p-2">
          <h3 className="font-semibold">{received.title}</h3>
          <div className="flex ">
            <div className="flex ">
              <h3 className="text-red-500 font-bold">{received.healthScore}</h3>
              <Heart className="text-red-500 fill-red-400" />
            </div>
            <div>
              <Save size={24} />
            </div>
            <div>
              <Archive size={24} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div>{stripHtmlTags(received.instructions)}</div>
      </div>

      {/* OPEN AI INTERGRATION  */}
    </div>
  );
}
