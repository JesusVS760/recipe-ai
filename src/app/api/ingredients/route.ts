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
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Convert file to base64 - stream approach
    const chunks: Uint8Array[] = [];
    const reader = file.stream().getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await ingredientService.createIngredient({
      base64Image: base64Image,
      userId: userId,
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
