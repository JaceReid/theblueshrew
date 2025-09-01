import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';         // important for Cloudflare Workers
export const dynamic = 'force-dynamic'; // avoids unwanted static optimization

type OrderItem = { name: string; size: string; quantity: number; price: string };
type CustomerInfo = { firstName: string; lastName: string; email: string; phone?: string };

export async function POST(req: NextRequest) {
  try {
    const { orderDetails, customerInfo } = (await req.json()) as {
      orderDetails: OrderItem[];
      customerInfo: CustomerInfo;
    };

    const apiKey = process.env.RESEND_API_KEY; // set in Cloudflare Pages → Settings → Environment variables (Preview)
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    // Example: send with Resend via fetch (works on Edge)
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Blueshrew <no-reply@theblueshrew.co.za>',
        to: ['theblueshreww@gmail.com'],
        subject: `New order from ${customerInfo.firstName} ${customerInfo.lastName}`,
        html: `
          <h3>New order</h3>
          <p>Customer: ${customerInfo.firstName} ${customerInfo.lastName} (${customerInfo.email})</p>
          <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
        `,
      }),
    });

    if (!r.ok) {
      const msg = await r.text();
      return NextResponse.json({ error: 'Email send failed', details: msg }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Bad request', details: String(err) }, { status: 400 });
  }
}