export default function RecipeCard({ recipeData }: any) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {recipeData.map((recipe: any) => (
        <div
          key={recipe.id}
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md  cursor-pointer hover:bg-amber-600 shadow-xl border-1 border-gray-200"
        >
          <h3 className="font-semibold">{recipe.title}</h3>
          <img
            className="rounded-2xl outline-2"
            src={recipe.image}
            alt={recipe.title}
          />
        </div>
      ))}
    </div>
  );
}
