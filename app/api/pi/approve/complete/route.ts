import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      completed: true,
      paymentId: body.paymentId || body.identifier,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Complete failed" },
      { status: 500 }
    );
  }
}
