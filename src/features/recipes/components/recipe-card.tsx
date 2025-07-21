import { useRouter } from "next/navigation";

export default function RecipeCard({ recipeData }: any) {
  const router = useRouter();

  const handleClick = (recipeData: any) => {
    router.push(`/dashboard/recipes/recipe-item?id=${recipeData.id}`);
  };
  // readyInMinutes
  return (
    <div className="grid grid-cols-3 gap-3">
      {recipeData.map((recipe: any) => (
        <div
          onClick={() => handleClick(recipe)}
          key={recipe.id}
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md  cursor-pointer hover:bg-amber-600 shadow-xl border-1 border-gray-200"
        >
          <div>
            <img
              className="rounded-2xl outline-2"
              src={recipe.image}
              alt={recipe.title}
            />
            <h2 className="text-black text-lg font-bold mt-2">
              {recipe.aggregateLikes}
            </h2>
          </div>
          <h3 className="font-semibold">{recipe.title}</h3>
        </div>
      ))}
    </div>
  );
}
