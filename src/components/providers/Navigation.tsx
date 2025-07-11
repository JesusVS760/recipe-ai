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

export default function Navigation() {
  return (
    <div className="relative flex items-center justify-between px-4 py-8 ">
      <div className="">
        <h1 className="font-bold text-xl">Recipe AI</h1>
      </div>

      <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2">
        <div className="flex items-center justify-center gap-2 bg-gray-200 py-2 px-4 rounded-full shadow-sm max-w-[130px]">
          <div>
            <span className="font-bold text-sm text-gray-600">
              <Link href="/">Home</Link>
            </span>
          </div>
          <div>
            <Home className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        <div className="flex flex-row items-center justify-center gap-2 bg-gray-200 py-2 px-4 rounded-full shadow-sm max-w-[130px]">
          <div>
            <span className="font-bold text-sm text-gray-600">
              <Link href="/">Meal Plans</Link>
            </span>
          </div>
          <div>
            <Apple className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 bg-gray-200 py-2 px-4 rounded-full shadow-sm max-w-[130px]">
          <div>
            <span className="font-bold text-sm text-gray-600">
              <Link href="/">Nutrition</Link>
            </span>
          </div>
          <div>
            <HeartPlus className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 bg-gray-200 py-2 px-4 rounded-full shadow-sm  max-w-[130px]">
          <div>
            <span className="font-bold text-sm text-gray-600">
              <Link href="/">Recipes</Link>
            </span>
          </div>
          <div>
            <Newspaper className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </nav>
      <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full  max-w-[130px]">
        <div className="bg-black p-2 rounded-full">
          <User className="w-4 h-4 text-white " />
        </div>
        <div>
          <span className="font-bold text-sm text-gray-600">
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer ">
                Name
              </DropdownMenuTrigger>
              <DropdownMenuContent className="animate-in fade-in zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 transition-all duration-300">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </div>
      </div>
    </div>
  );
}
