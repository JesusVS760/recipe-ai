import { imageGenerationService } from "@/services/image-generation-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const result = imageGenerationService.generateImage(text);

    if (!result) {
      return "Invalid image";
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
