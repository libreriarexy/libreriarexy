import { Resend } from 'resend';

// If API key is not present, we mock it.
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function sendEmail(to: string, subject: string, html: string) {
    if (!resend) {
        console.log("---------------------------------------------------");
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
        console.log("---------------------------------------------------");
        return { success: true };
    }

    try {
        await resend.emails.send({
            from: 'WebRexy <onboarding@resend.dev>', // Generic Resend sender
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to send email", error);
        return { success: false, error };
    }
}
