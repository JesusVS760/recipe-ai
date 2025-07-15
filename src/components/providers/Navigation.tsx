"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Apple,
  HeartPlus,
  Home,
  Icon,
  Newspaper,
  PersonStanding,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const found = sessionStorage.getItem("firstName");
      setName(found ?? "User");
    } catch {}
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-6">
      <div>
        <h1 className="font-bold text-xl">Recipe AI</h1>
      </div>

      <nav className="flex items-center gap-4">
        {[
          { label: "Home", icon: <Home className="w-4 h-4 text-gray-600" /> },
          {
            label: "Meal Plans",
            icon: <Apple className="w-4 h-4 text-gray-600" />,
          },
          {
            label: "Nutrition",
            icon: <HeartPlus className="w-4 h-4 text-gray-600" />,
          },
          {
            label: "Recipes",
            icon: <Newspaper className="w-4 h-4 text-gray-600" />,
          },
        ].map(({ label, icon }, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-200 py-2 px-4 rounded-full shadow-sm"
          >
            <span className="font-bold text-sm text-gray-600">
              <Link href="/">{label}</Link>
            </span>
            {icon}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <div className="bg-black p-2 rounded-full">
          <User className="w-4 h-4 text-white" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="font-bold text-sm text-gray-600 cursor-pointer">
            {name}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="transition-all duration-300">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
