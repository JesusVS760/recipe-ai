import { getSession } from "@/lib/auth";
import { mealPlanService } from "@/services/meal-plan-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const mealPlans = await mealPlanService.getMealPlans(user.id);

    return NextResponse.json({ mealPlans });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch meal plans" },
      { status: 500 }
    );
  }
}
