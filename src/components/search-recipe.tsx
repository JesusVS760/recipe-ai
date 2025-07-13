import { Search } from "lucide-react";

export default function SearchRecipe() {
  return (
    <div className="flex items-center w-full bg-gray-100 px-4 py-2 rounded-lg shadow-sm gap-2">
      <Search className="w-4 h-4 text-gray-600" />
      <input
        type="text"
        placeholder="Search by receipts and more"
        className="w-full bg-transparent outline-none text-sm"
      />
    </div>
  );
}
