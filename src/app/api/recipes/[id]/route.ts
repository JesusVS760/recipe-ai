import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const recipe = await response.json();
    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
