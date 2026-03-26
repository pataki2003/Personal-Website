const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
    if (!isPostRequest(req)) {
        return res.status(405).json({ error: "Method not allowed." });
    }

    try {
        const payload = normalizePayload(req.body);
        const validationError = validatePayload(payload);

        if (validationError) {
            return res.status(validationError.status).json({ error: validationError.message });
        }

        const emailConfig = getEmailConfig();

        if (!emailConfig) {
            return res.status(500).json({ error: "Email service is not configured." });
        }

        const emailContent = buildEmailContent(payload);
        const providerResponse = await sendEmail(emailConfig, payload.email, emailContent);

        if (!providerResponse.ok) {
            console.error("Resend API error:", providerResponse.data);
            return res.status(500).json({ error: "Failed to send email." });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Contact API error:", error);
        return res.status(500).json({ error: "Something went wrong while sending the message." });
    }
}

function isPostRequest(req) {
    return req.method === "POST";
}

function normalizePayload(body) {
    return {
        name: normalizeField(body?.name),
        email: normalizeField(body?.email),
        projectType: normalizeField(body?.projectType),
        budget: normalizeField(body?.budget),
        message: normalizeField(body?.message),
    };
}

function normalizeField(value) {
    return typeof value === "string" ? value.trim() : "";
}

function validatePayload(payload) {
    if (!payload.name || !payload.email || !payload.projectType || !payload.message) {
        return { status: 400, message: "Missing required fields." };
    }

    if (!EMAIL_REGEX.test(payload.email)) {
        return { status: 400, message: "Invalid email address." };
    }

    return null;
}

function getEmailConfig() {
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!resendApiKey || !toEmail || !fromEmail) {
        return null;
    }

    return { resendApiKey, toEmail, fromEmail };
}

function buildEmailContent(payload) {
    const budgetLabel = payload.budget || "Not specified";

    return {
        subject: `New lead: ${payload.projectType} (${budgetLabel})`,
        html: `
            <div style="font-family: Inter, Arial, sans-serif; background:#f5f7fb; padding:24px;">
                <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; padding:28px; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
                    <h2 style="margin:0 0 16px; font-size:22px;">
                        New portfolio message
                    </h2>

                    <p style="margin:0 0 20px; color:#6b7280;">
                        Someone just contacted you through your website.
                    </p>

                    <div style="margin-bottom:20px;">
                        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
                        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
                        <p><strong>Project type:</strong> ${escapeHtml(payload.projectType)}</p>
                        <p><strong>Budget:</strong> ${escapeHtml(budgetLabel)}</p>
                    </div>

                    <div style="margin:20px 0;">
                        <p style="font-weight:600; margin-bottom:8px;">Message</p>
                        <div style="background:#f3f4f6; padding:16px; border-radius:10px; white-space:pre-wrap;">
                            ${escapeHtml(payload.message)}
                        </div>
                    </div>

                    <div style="margin-top:24px;">
                        <a href="mailto:${escapeHtml(payload.email)}"
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
        `,
    };
}

async function sendEmail(config, replyToEmail, emailContent) {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${config.resendApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: config.fromEmail,
            to: [config.toEmail],
            reply_to: replyToEmail,
            subject: emailContent.subject,
            html: emailContent.html,
        }),
    });

    const data = await response.json();

    return {
        ok: response.ok,
        data,
    };
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
