import { mealPlanService } from "@/services/meal-plan-service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const { id } = await params;
  try {
    if (!id) {
      return NextResponse.json(
        { error: "Recipe ID required" },
        { status: 400 }
      );
    }

    const deletedPlan = await mealPlanService.deleteMealPlan(id);

    return NextResponse.json({ task: deletedPlan }, { status: 200 });
  } catch (error) {
    console.log("Error deleting Task:", error);
    return NextResponse.json(
      { error: "Error deleting meal plan" },
      { status: 500 }
    );
  }
}
