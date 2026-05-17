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
    route: "pi complete",
    hasApiKey: Boolean(getPiApiKey()),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paymentId = body.paymentId || body.identifier || body.payment_id;
    const txid = body.txid || "";

    const apiKey = getPiApiKey();

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId missing" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });
    }

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    const data = await response.json();

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Complete failed",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
