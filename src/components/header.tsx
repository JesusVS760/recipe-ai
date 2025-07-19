"use client";

import { useEffect, useState } from "react";
import SearchRecipes from "@/app/dashboard/recipes/SearchRecipes";

export default function Header() {
  const [name, setName] = useState<String | null>(null);

  useEffect(() => {
    try {
      const user = sessionStorage.getItem("firstName");
      setName(user ?? "User");
    } catch {
      setName("User");
    }
  }, []);

  return (
    <div className="w-full flex flex-row item-center">
      <div className="flex flex-col items-start pr-4">
        <div className="text-3xl">
          Hello, <span className="font-bold text-black text-3xl">{name}</span>
        </div>
        <div>You are achieving greatness</div>
      </div>
      {/* <div className="flex-grow">
        <SearchRecipes />
      </div> */}
    </div>
  );
}
