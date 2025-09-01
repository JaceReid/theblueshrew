// app/api/send-order-notification/route.ts
export const runtime = 'edge';

type OrderItem = {
  id: number;
  name: string;
  price: string; // "R400"
  image: string;
  quantity: number;
  size: string;
};

export async function POST(req: Request) {
  try {
    const { orderDetails, customerInfo, totalAmount, referenceNumber } = await req.json() as {
      orderDetails: OrderItem[];
      customerInfo: { firstName: string; lastName: string; email: string; phone?: string };
      totalAmount: number;
      referenceNumber: string;
    };

    const RESEND_API_KEY = process.env.RESEND_API_KEY!;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'The Blue Shrew <orders@theblueshrew.co.za>'; // set this in Cloudflare

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing RESEND_API_KEY' }), { status: 500 });
    }

    const adminHtml = `
      <h2>New Order Received</h2>
      <p><b>Reference:</b> ${referenceNumber}</p>
      <p><b>Customer:</b> ${customerInfo.firstName} ${customerInfo.lastName}</p>
      <p><b>Email:</b> ${customerInfo.email}${customerInfo.phone ? ` | <b>Phone:</b> ${customerInfo.phone}` : ''}</p>
      <hr/>
      <ul>
        ${orderDetails.map(i => `<li>${i.name} (${i.size}) &times; ${i.quantity} — ${i.price}</li>`).join('')}
      </ul>
      <p><b>Total:</b> R${totalAmount}</p>
    `;

    const customerHtml = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Thanks for your order 🎉</h2>
        <p>Hi ${customerInfo.firstName},</p>
        <p>We’ve received your order. Keep this reference for EFT/SnapScan and tracking:</p>
        <p style="font-size:18px;"><b>Reference:</b> <code>${referenceNumber}</code></p>
        <h3>Order Summary</h3>
        <ul>
          ${orderDetails.map(i => `<li>${i.name} (${i.size}) × ${i.quantity} — ${i.price}</li>`).join('')}
        </ul>
        <p><b>Total:</b> R${totalAmount}</p>
        <hr/>
        <h3>Payment Details</h3>
        <p><b>EFT</b>: Standard Bank · Acc: 08 604 666 7 · Type: Current · Branch: 314<br/>
        <b>Reference:</b> ${referenceNumber}</p>
        <p>Or pay via SnapScan (as shown at checkout).</p>
        <p>Once paid, please email proof to <a href="mailto:theblueshreww@gmail.com">theblueshreww@gmail.com</a>.</p>
        <p>— The Blue Shrew</p>
      </div>
    `;

await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: FROM_EMAIL,
    to: customerInfo.email,
    subject: `Your TheBlueShrew order receipt (${referenceNumber})`,
    html: customerHtml,
    attachments: [
      {
        // remote file is easiest — or use base64 `content:` instead
        path: 'https://theblueshrew.co.za/logo.png',
        filename: 'logo.png',
        content_id: 'brand-logo',
      },
    ],
  }),
});


    const sendEmail = (to: string | string[], subject: string, html: string) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to,
          subject,
          html,
          // text: 'Optional plain-text fallback',
        }),
      }).then(r => r.ok ? r.json() : r.text().then(t => Promise.reject(t)));

    // 1) Notify you (seller)  2) Send receipt to buyer
    await Promise.all([
      sendEmail('theblueshreww@gmail.com', `New order: ${referenceNumber}`, adminHtml),
      sendEmail(customerInfo.email, `Your TheBlueShrew order receipt (${referenceNumber})`, customerHtml),
    ]);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
