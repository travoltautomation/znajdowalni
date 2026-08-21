const required = ["email", "consent"];

module.exports = async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  const payload = request.body || {};
  if (required.some((key) => !payload[key])) return response.status(400).json({ error: "Uzupełnij wymagane pola." });

  const webhook = process.env.PREVIEW_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const recipient = process.env.PREVIEW_RECIPIENT_EMAIL;

  // Bez zmiennych środowiskowych endpoint nie zapisuje ani nie przekazuje danych.
  if (!webhook && !(resendKey && recipient)) return response.status(503).json({ demo: true, error: "Preview delivery is not configured." });

  try {
    if (webhook) {
      const upstream = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: payload.type || "preview-request", submittedAt: new Date().toISOString(), ...payload }) });
      if (!upstream.ok) throw new Error("Webhook failed");
    } else {
      const subject = `${payload.type === "contact-request" ? "Nowa wiadomość kontaktowa" : "Nowa prośba o preview"}: ${payload.company || payload.name || payload.source || payload.email}`;
      const text = Object.entries(payload).map(([key, value]) => `${key}: ${value}`).join("\n");
      const upstream = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || "Znajdowalni <onboarding@resend.dev>", to: [recipient], reply_to: payload.email, subject, text }) });
      if (!upstream.ok) throw new Error("Resend failed");
    }
    return response.status(200).json({ ok: true });
  } catch { return response.status(502).json({ error: "Nie udało się przekazać zgłoszenia." }); }
}
