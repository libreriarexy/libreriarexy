import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Encapsula el contenido del mail en un diseño profesional.
 */
function getEmailWrapper(content: string) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(18, 34, 65, 0.1); }
            .header { background-color: #122241; padding: 40px 20px; text-align: center; }
            .logo { max-width: 150px; height: auto; margin-bottom: 20px; }
            .content { padding: 40px; color: #122241; line-height: 1.6; }
            .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
            .button { display: inline-block; padding: 14px 32px; background-color: #facc15; color: #122241 !important; text-decoration: none; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0; }
            .card { background-color: #f1f5f9; border-radius: 16px; padding: 24px; margin: 20px 0; border-left: 4px solid #facc15; }
            h1 { font-weight: 900; letter-spacing: -0.025em; margin: 0; text-transform: uppercase; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://webrexy.vercel.app/logo.jpg" alt="Librería Rexy" class="logo">
                <h1 style="color: #facc15; font-size: 24px;">Librería Rexy</h1>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Librería Rexy - Todos los derechos reservados.</p>
                <p>Santa Fe, Argentina</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export async function sendEmail(to: string, subject: string, htmlContent: string) {
    // Si no hay credenciales, usamos mock para no romper el flujo
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log("--- MOCK EMAIL ---");
        console.log(`Para: ${to}`);
        console.log(`Asunto: ${subject}`);
        console.log(`Contenido: ${htmlContent}`);
        return { success: true, message: "Mock email logged." };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Librería Rexy" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: getEmailWrapper(htmlContent),
        });

        console.log("Mensaje enviado: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Error enviando email con Nodemailer:", error);
        return { success: false, error };
    }
}
