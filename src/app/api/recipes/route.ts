import { getSession } from "@/lib/auth";
import { recipeService } from "@/services/recipe-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getSession();
    console.log("User id: ", user);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const recipes = await recipeService.getRecipes(user.id);

    return NextResponse.json({ recipes });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipeData = await req.json();
    const recipe = await recipeService.createRecipe({
      ...recipeData,
      user: {
        connect: {
          id: user?.id,
        },
      },
    });
    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error to create recipe" },
      { status: 500 }
    );
  }
}
