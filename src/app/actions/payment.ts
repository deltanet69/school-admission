"use server"

import snap from "@/lib/midtrans"
import { supabase } from "@/lib/supabaseClient"
import { sendEmail } from "@/lib/email"

export async function createPaymentTransaction(admissionId: string, applicantName: string, email: string, phone: string, amount: number = 500000) {
    try {
        const transactionDetails = {
            transaction_details: {
                // Shorten order_id to fit Midtrans limit (max 50 chars)
                // UUID (36) + Timestamp (13) + Prefix (4) was too long.
                // New format: ADM-{first_8_chars_of_uuid}-{timestamp} -> ~26 chars
                order_id: `ADM-${admissionId.split('-')[0]}-${Date.now()}`,
                gross_amount: amount,
            },
            customer_details: {
                first_name: applicantName,
                email: email,
                phone: phone,
            },
            item_details: [
                {
                    id: "ADMISSION_FEE",
                    price: amount,
                    quantity: 1,
                    name: "Admission Fee",
                },
            ],
            callbacks: {
                finish: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admission/success?order_id=${transactionDetails.transaction_details.order_id}`
            }
        };

        console.log("---------------------------------------------------")
        console.log("INITIATING MIDTRANS TRANSACTION")
        console.log("Order ID:", transactionDetails.transaction_details.order_id)
        console.log("Gross Amount:", transactionDetails.transaction_details.gross_amount)
        console.log("Customer Email:", transactionDetails.customer_details.email)
        console.log("Callback URL:", transactionDetails.callbacks.finish)
        console.log("---------------------------------------------------")

        const transaction = await snap.createTransaction(transactionDetails);
        const paymentToken = transaction.token;
        const paymentUrl = transaction.redirect_url;

        // Update admission record with payment info
        const { error } = await supabase
            .from('admissions')
            .update({
                payment_token: paymentToken,
                payment_url: paymentUrl,
                amount: amount,
                payment_status: 'pending', // Initial status
                order_id: transactionDetails.transaction_details.order_id // Save order_id for tracking
            })
            .eq('id', admissionId)

        if (error) throw new Error(`Failed to update admission: ${error.message}`)

        // Send Email Notification
        await sendEmail({
            to: email,
            subject: "Admission Payment - Horizon Academy",
            html: `
                <h1>Complete Your Registration</h1>
                <p>Dear ${applicantName},</p>
                <p>Thank you for registering. To complete your admission process, please proceed with the payment of <strong>IDR ${amount.toLocaleString()}</strong>.</p>
                <p>Payment Link: <a href="${paymentUrl}">${paymentUrl}</a></p>
                <p>After payment, please confirm via WhatsApp.</p>
            `
        })

        return { success: true, paymentUrl, paymentToken }

    } catch (error: any) {
        console.error("---------------------------------------------------")
        console.error("MIDTRANS TRANSACTION FAILED")
        console.error("Error Message:", error.message)
        // Avoid circular structure error by only logging safe properties
        if (error.ApiResponse) {
            console.error("Midtrans API Response:", JSON.stringify(error.ApiResponse, null, 2))
        } else {
            console.error("Error Details:", error)
        }
        console.error("---------------------------------------------------")

        return { success: false, error: error.message || "Payment generation failed" }
    }
}
