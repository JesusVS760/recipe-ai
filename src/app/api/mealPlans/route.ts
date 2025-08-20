import { getSession } from "@/lib/auth";
import { mealPlanService } from "@/services/meal-plan-service";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" });
    }
    const mealPLanData = await req.json();
    console.log("reached");

    const mealPLan = await mealPlanService.createMealPlan({
      ...mealPLanData,
      user: {
        connect: {
          id: user?.id,
        },
      },
    });

    if (!mealPLan) {
      return NextResponse.json({ error: "Failed to create meal plan." });
    }

    return NextResponse.json({ mealPLan }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error to create meal plan" },
      { status: 500 }
    );
  }
}
