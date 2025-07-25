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
    <div className="grid grid-cols-3 gap-3">
      <Toaster />
      <ConfirmDialog />

      {recipeData.map((recipe: any) => (
        <div
          key={recipe.id}
          className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-md  cursor-pointer hover:bg-amber-600 shadow-xl border-1 border-gray-200"
        >
          <div>
            <img
              className="rounded-2xl outline-2"
              src={recipe.imageUrl}
              alt={recipe.title}
            />
            <h2 className="text-black text-lg font-bold mt-2">
              {recipe.aggregateLikes}
            </h2>
          </div>
          <h3 className="font-semibold">{recipe.title}</h3>
          <div onClick={() => handleCancel(recipe.id)}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className=" cursor-pointer text-black hover:text-gray-600"
            >
              <Trash size={18} />
            </motion.button>
          </div>
        </div>
      ))}
    </div>
  );
}
