const required = ["email", "consent"];

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#39;");

const buildMessage = (payload) => {
  const isContact = payload.type === "contact-request";
  const name = payload.name || "Nie podano";
  const title = isContact ? `Nowe zapytanie kontaktowe · ${name}` : `Nowy bezpłatny preview · ${name}`;
  const intro = isContact
    ? "Ktoś napisał przez formularz kontaktowy na stronie Znajdowalni."
    : "Ktoś poprosił o przygotowanie prywatnego podglądu strony.";
  const fields = [
    ["Imię", payload.name],
    ["E-mail", payload.email],
    ["Telefon", payload.phone],
    ["Strona / Google / Booksy", payload.source],
    ["Firma", payload.company],
    ["Branża", payload.business],
    ["Miasto", payload.city],
    ["Wiadomość", payload.message],
  ].filter(([, value]) => value);
  const text = [intro, "", ...fields.map(([label, value]) => `${label}: ${value}`)].join("\n");
  const rows = fields.map(([label, value]) => `<tr><td style="padding:10px 0;color:#59615f;font-size:13px;vertical-align:top;width:35%">${escapeHtml(label)}</td><td style="padding:10px 0;color:#121416;font-size:15px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("");
  const html = `<!doctype html><html lang="pl"><body style="margin:0;background:#f7f3ea;font-family:Arial,sans-serif;color:#121416"><div style="max-width:640px;margin:24px auto;padding:0 16px"><div style="background:#121416;color:#f7f3ea;padding:22px 24px;border-bottom:5px solid #17b2a6"><div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#b9f24a">Znajdowalni</div><h1 style="margin:12px 0 0;font-size:25px;line-height:1.2">${escapeHtml(title)}</h1></div><div style="background:#fffdf8;padding:22px 24px;border:1px solid #121416;border-top:0"><p style="margin:0 0 16px;font-size:16px;line-height:1.5">${escapeHtml(intro)}</p><table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table><p style="margin:22px 0 0;padding-top:16px;border-top:1px solid #d8ddd8;color:#59615f;font-size:12px">Odpowiedz bezpośrednio na tę wiadomość, aby odpisać klientowi.</p></div></div></body></html>`;
  return { title, text, html };
};

module.exports = async function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });
  const payload = request.body || {};
  if (required.some((key) => !payload[key])) return response.status(400).json({ error: "Uzupełnij wymagane pola." });

  const webhook = process.env.PREVIEW_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const recipient = process.env.PREVIEW_RECIPIENT_EMAIL;
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpRecipient = process.env.SMTP_RECIPIENT_EMAIL || recipient;
  const smtpRecipients = Array.from(new Set([...smtpRecipient.split(","), smtpUser].map((address) => address.trim()).filter(Boolean)));

  // Bez zmiennych środowiskowych endpoint nie zapisuje ani nie przekazuje danych.
  if (!webhook && !(resendKey && recipient) && !(smtpHost && smtpUser && smtpPass && smtpRecipient)) return response.status(503).json({ demo: true, error: "Preview delivery is not configured." });

  try {
    const message = buildMessage(payload);
    if (webhook) {
      const upstream = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: payload.type || "preview-request", submittedAt: new Date().toISOString(), ...payload }) });
      if (!upstream.ok) throw new Error("Webhook failed");
    } else if (resendKey && recipient) {
      const upstream = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || "Znajdowalni <onboarding@resend.dev>", to: [recipient], reply_to: payload.email, subject: message.title, text: message.text, html: message.html }) });
      if (!upstream.ok) throw new Error("Resend failed");
    } else {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || "true") !== "false",
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000,
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || smtpUser,
        to: smtpRecipients,
        replyTo: payload.email,
        subject: message.title,
        text: message.text,
        html: message.html,
      });
    }
    return response.status(200).json({ ok: true });
  } catch { return response.status(502).json({ error: "Nie udało się przekazać zgłoszenia." }); }
}
