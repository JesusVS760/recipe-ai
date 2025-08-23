import { Trash } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useConfirm } from "../use-confirm";
import { motion } from "framer-motion";
import { useMealPlanMutations } from "./meal-plan-mutations";

export default function MealPlanCard({
  mealPlanData,
}: {
  mealPlanData: any[];
}) {
  const { deleteMealPlan } = useMealPlanMutations();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  console.log(mealPlanData);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure 🤔?",
    "You are about to delete this task"
  );

  const handleCancel = async (mealPlanId: string) => {
    const ok = await confirm();
    if (ok) {
      try {
        await deleteMealPlan.mutateAsync(mealPlanId);
        toast("Meal Plan successfully deleted ✔️!");
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };
  return (
    <div className="space-y-4">
      <Toaster />
      <ConfirmDialog />

      {mealPlanData.map((plan, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4 border">
          <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Start: {formatDate(plan.startDate)}</div>
            <div>End: {formatDate(plan.endDate)}</div>
          </div>
          <div onClick={() => handleCancel(plan.id)}>
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
      ))}
    </div>
  );
}
