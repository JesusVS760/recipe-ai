"use client";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdvertisementRecipe() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/recipes");
  };

  return (
    <div className=" flex flex-col gap-4 bg-purple-400 p-4 max-w-xs rounded-2xl ">
      <div className="flex">
        <Star fill="white" />
        <Star fill="white" />
        <Star fill="white" />
        <Star fill="white" />
        <Star fill="white" />
      </div>
      <div>
        <h2 className="text-white text-xl font-extrabold">
          Got a Recipe That Rocks?
        </h2>
        <p className="text-white/80">
          Share it & Shine! Your recipe might just become the next big thing!
        </p>
      </div>
      <button
        onClick={handleClick}
        className="w-full outline-1 outline-white p-2 rounded-2xl text-white cursor-pointer hover:bg-white hover:text-black"
      >
        + Add Recipe
      </button>
    </div>
  );
}
