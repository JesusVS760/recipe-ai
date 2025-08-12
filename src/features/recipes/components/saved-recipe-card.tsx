import { useRecipeMutations } from "@/hooks/recipe-mutations";
import { useConfirm } from "@/hooks/use-confirm";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";

export default function SavedRecipeCard({ recipeData }: any) {
  const { deleteRecipe } = useRecipeMutations();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure 🤔?",
    "You are about to delete this task"
  );

  const handleCancel = async (recipeId: string) => {
    const ok = await confirm();
    if (ok) {
      try {
        await deleteRecipe.mutateAsync(recipeId);
        toast("Recipe successfully deleted ✔️!");
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div>
      <Toaster />
      <ConfirmDialog />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {recipeData.map((recipe: any) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200 group"
          >
            <div className="relative overflow-hidden">
              <img
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                src={recipe.imageUrl}
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

              {/* Footer with Time and Delete */}
              <div className="flex items-center justify-between">
                {/* Time Badge */}
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">
                    {recipe.readyInMinutes} min
                  </span>
                </div>

                {/* Delete Button */}
                <div onClick={() => handleCancel(recipe.id)}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Delete recipe"
                  >
                    <Trash size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
