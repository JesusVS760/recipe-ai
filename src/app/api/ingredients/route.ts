import { getSession } from "@/lib/auth";
import { ingredientService } from "@/services/ingredient-service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ingredients = await ingredientService.getIngredients(user.id);
    return NextResponse.json({ ingredients });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch ingredients" },
      { status: 500 }
    );
  }
}
