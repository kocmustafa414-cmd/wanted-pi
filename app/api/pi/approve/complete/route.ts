import { NextResponse } from "next/server";

function getPiApiKey() {
  return (
    process.env.PI_API_KEY ||
    process.env.PI_API_ANAHTARI ||
    process.env.NEXT_PUBLIC_PI_API_KEY ||
    ""
  );
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "pi approve",
    hasApiKey: Boolean(getPiApiKey()),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paymentId = body.paymentId || body.identifier || body.payment_id;
    const apiKey = getPiApiKey();

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId missing" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Approve failed", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
