import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET() {
    try {
        const result = await sendEmail({
            to: "opangdesign@gmail.com", // Ganti dengan email kamu
            subject: "Test Email dari JACOS",
            html: `
                <h1>Test Email</h1>
                <p>Ini adalah test email dari sistem JACOS.</p>
                <p>Waktu: ${new Date().toLocaleString('id-ID')}</p>
                <p>SMTP Host: ${process.env.SMTP_HOST}</p>
            `
        });

        return NextResponse.json({
            success: true,
            message: "Email sent",
            result
        });
    } catch (error) {
        console.error("Test email error:", error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}

// Optional: Tambah method POST juga
export async function POST() {
    return GET();
}