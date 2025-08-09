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
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const ingredient = await ingredientService.createIngredient({
      imageFile: image,
      userId: user.id,
    });

    return NextResponse.json({ ingredient }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create ingredient" },
      { status: 500 }
    );
  }
}
