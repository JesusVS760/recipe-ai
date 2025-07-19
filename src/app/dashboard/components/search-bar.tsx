"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBarLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to recipes page with search query
      router.push(
        `/dashboard/recipes?search=${encodeURIComponent(searchQuery)}`
      );
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm gap-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search by recipes and more"
        className="w-full bg-transparent outline-none text-sm"
      />
      <button
        onClick={handleSearch}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  );
}
