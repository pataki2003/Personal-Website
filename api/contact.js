export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    try {
        const { name, email, projectType, budget, message } = req.body ?? {};

        if (!name || !email || !projectType || !message) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const toEmail = process.env.CONTACT_TO_EMAIL;
        const fromEmail = process.env.CONTACT_FROM_EMAIL;

        if (!resendApiKey || !toEmail || !fromEmail) {
            return res.status(500).json({ error: "Email service is not configured." });
        }

        const emailHtml = `
            <div style="font-family: Inter, Arial, sans-serif; background:#f5f7fb; padding:24px;">
                
                <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; padding:28px; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
                
                <h2 style="margin:0 0 16px; font-size:22px;">
                    🚀 New portfolio message
                </h2>

                <p style="margin:0 0 20px; color:#6b7280;">
                    Someone just contacted you through your website.
                </p>

                <div style="margin-bottom:20px;">
                    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Project:</strong> ${escapeHtml(projectType)}</p>
                    <p><strong>Budget:</strong> ${escapeHtml(budget || "Not specified")}</p>
                </div>

                <div style="margin:20px 0;">
                    <p style="font-weight:600; margin-bottom:8px;">Message</p>
                    <div style="background:#f3f4f6; padding:16px; border-radius:10px; white-space:pre-wrap;">
                    ${escapeHtml(message)}
                    </div>
                </div>

                <div style="margin-top:24px;">
                    <a href="mailto:${escapeHtml(email)}"
                    style="display:inline-block; padding:12px 18px; background:#2563eb; color:#fff; border-radius:8px; text-decoration:none; font-weight:600;">
                    Reply directly
                    </a>
                </div>

                <hr style="margin:28px 0; border:none; border-top:1px solid #e5e7eb;" />

                <p style="font-size:12px; color:#9ca3af;">
                    Sent from your portfolio contact form (pataki-dev.hu)
                </p>

                </div>
            </div>
        `;

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [toEmail],
                reply_to: email,
                subject: `🚀 New Lead: ${projectType} (${budget || "No budget"})`,
                html: emailHtml,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend API error:", data);
            return res.status(500).json({ error: "Failed to send email." });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Contact API error:", error);
        return res.status(500).json({ error: "Something went wrong while sending the message." });
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}