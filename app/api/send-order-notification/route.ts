export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const { orderDetails, customerInfo, totalAmount, referenceNumber } = await request.json();

  const itemsHtml = (orderDetails || [])
    .map((it: any) => `<li>${it.name} (${it.size}) × ${it.quantity} — ${it.price}</li>`)
    .join("");

  const html = `
    <h2>New order: ${referenceNumber}</h2>
    <p><strong>${customerInfo.firstName} ${customerInfo.lastName}</strong><br/>
       ${customerInfo.email} · ${customerInfo.phone || "-"}</p>
    <p><strong>Total: R${totalAmount}</strong></p>
    <ul>${itemsHtml}</ul>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // IMPORTANT: from must be on your verified domain/subdomain
      from: "TheBlueShrew <orders@theblueshrew.co.za>",
      to: ["theblueshreww@gmail.com"],
      subject: `New order ${referenceNumber}`,
      html,
    }),
  });

  if (!res.ok) return new Response(await res.text(), { status: 500 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
