export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const apiKey = env.RESEND_API_KEY as string;
  if (!apiKey) {
    return new Response(JSON.stringify({ ok: false, error: "Missing RESEND_API_KEY" }), { status: 500 });
  }

  const { orderDetails, customerInfo, totalAmount, referenceNumber } = await request.json<any>();

  const itemsHtml = (orderDetails || [])
    .map((it: any) => `<li>${it.name} (${it.size}) × ${it.quantity} — ${it.price}</li>`)
    .join("");

  const html = `
    <h2>New order: ${referenceNumber}</h2>
    <p><strong>${customerInfo.firstName} ${customerInfo.lastName}</strong><br/>
       ${customerInfo.email} · ${customerInfo.phone || "-"}</p>
    <p><strong>Total: R${totalAmount}</strong></p>
    <ul>${itemsHtml}</ul>
  `;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,   // ✅ use the env key here
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "TheBlueShrew <orders@theblueshrew.co.za>", // must be on your verified Resend domain later
      to: ["theblueshreww@gmail.com"],                          // any real inbox is fine
      subject: `New order ${referenceNumber}`,
      html,
    }),
  });

  if (!r.ok) return new Response(await r.text(), { status: 500 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

