import { NextResponse } from "next/server";

export async function GET() {
  try {
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "failed to fetch recipes" },
      { status: 500 }
    );
  }
}
