import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      approved: true,
      paymentId: body.paymentId || body.identifier,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Approve failed" },
      { status: 500 }
    );
  }
}
