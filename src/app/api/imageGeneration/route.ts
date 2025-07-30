import { imageGenerationService } from "@/services/image-generation-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("API: Full request body:", body);

    const { text } = body;
    console.log("API: Extracted text:", text);

    const result = await imageGenerationService.generateImage(text);
    if (!result) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.log("API error", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
