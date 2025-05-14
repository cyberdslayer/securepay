import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "API is working correctly" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: "POST request received",
      receivedData: body
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to parse request body",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 400 });
  }
}