import { recipeService } from "@/services/recipe-service";
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

    const deletedTask = await recipeService.deleteRecipe(id);

    return NextResponse.json({ task: deletedTask }, { status: 200 });
  } catch (error) {
    console.log("Error deleting Task:", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
