import { useRouter } from "next/navigation";

export default function RecipeCard({ recipeData }: any) {
  const router = useRouter();

  const handleClick = (recipeData: any) => {
    router.push(`/dashboard/recipes/recipe-item?id=${recipeData.id}`);
  };
  // readyInMinutes
  // NOTE FIX LIKES BUG
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {recipeData.map((recipe: any) => (
        <div
          onClick={() => handleClick(recipe)}
          key={recipe.id}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200 group cursor-pointer transform hover:-translate-y-1 "
        >
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              src={recipe.image}
              alt={recipe.title}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/400x200?text=Recipe+Image";
              }}
            />
          </div>

          {/* Content Container */}
          <div className="p-5">
            {/* Title */}
            <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
              {recipe.title}
            </h3>

            {/* Likes Section */}
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-lg font-bold text-gray-700">
                {recipe.aggregateLikes}
              </span>
              <span className="text-sm text-gray-500">likes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
