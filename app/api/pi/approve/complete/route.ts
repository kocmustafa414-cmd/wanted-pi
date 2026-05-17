import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json();

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_ANAHTARI}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txid }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Complete failed", details: error },
      { status: 500 }
    );
  }
}
