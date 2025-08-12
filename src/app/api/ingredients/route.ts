import { getSession } from "@/lib/auth";
import { ingredientService } from "@/services/ingredient-service";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    const user = await getSession();
    console.log(user?.id);

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!user?.id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await ingredientService.createIngredient({
      base64Image: base64Image,
      userId: user.id,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
