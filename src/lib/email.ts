"use server"
import nodemailer from "nodemailer"

export async function sendEmail({
    to,
    subject,
    html
}: {
    to: string;
    subject: string;
    html: string;
}) {
    console.log("------------------------------------------");
    console.log("Initializing Email Transporter...");
    console.log("HOST:", process.env.SMTP_HOST || "smtp.hostinger.com");
    console.log("PORT:", process.env.SMTP_PORT || "465");
    console.log("USER:", process.env.SMTP_USER);
    console.log("PASS:", process.env.SMTP_PASSWORD ? `**** (${process.env.SMTP_PASSWORD.length} chars)` : "NOT SET");
    console.log("------------------------------------------");

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.hostinger.com",
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    })

    try {
        const info = await transporter.sendMail({
            from: `Horizon Academy <${process.env.EMAIL_FROM || "support@jacos.id"}>`,
            to,
            subject,
            html,
        })

        console.log("Message sent: %s", info.messageId)
        return { success: true }
    } catch (error) {
        console.error("Error sending email:", error)
        return { success: false, error }
    }
}
