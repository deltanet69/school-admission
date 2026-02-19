import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Safe logging logic to avoid circular structure errors
        const logSafeBody = { ...body };
        // Truncate long fields if necessary or log specific fields
        console.log("---------------------------------------------------");
        console.log("MIDTRANS NOTIFICATION RECEIVED");
        console.log("Order ID:", body.order_id);
        console.log("Status:", body.transaction_status);
        console.log("Fraud Status:", body.fraud_status);
        console.log("---------------------------------------------------");


        // 1. Verify Signature
        const signatureKey = body.signature_key;
        const serverKey = process.env.MIDTRANS_SERVER_KEY;

        if (!serverKey) {
            console.error("SERVER KEY NOT FOUND");
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }

        const computedSignature = crypto
            .createHash("sha512")
            .update(`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`)
            .digest("hex");

        if (signatureKey !== computedSignature) {
            console.error("INVALID SIGNATURE");
            return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
        }

        // 2. Determine Payment Status
        let paymentStatus: 'paid' | 'pending' | 'failed' = 'pending';
        const transactionStatus = body.transaction_status;
        const fraudStatus = body.fraud_status;

        if (transactionStatus === 'capture') {
            if (fraudStatus === 'challenge') {
                paymentStatus = 'pending';
            } else if (fraudStatus === 'accept') {
                paymentStatus = 'paid';
            }
        } else if (transactionStatus === 'settlement') {
            paymentStatus = 'paid';
        } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
            paymentStatus = 'failed';
        } else if (transactionStatus === 'pending') {
            paymentStatus = 'pending';
        }


        // 3. Update Database using order_id
        if (paymentStatus !== 'pending') {
            const { error } = await supabase
                .from('admissions')
                .update({
                    payment_status: paymentStatus
                })
                .eq('order_id', body.order_id);

            if (error) {
                console.error("FAILED TO UPDATE DATABASE:", error);
                return NextResponse.json({ message: "Database update failed" }, { status: 500 });
            }

            console.log(`Updated Order ${body.order_id} to status: ${paymentStatus}`);
        } else {
            console.log(`Order ${body.order_id} status remains pending`);
        }


        return NextResponse.json({ message: "OK" });

    } catch (error: any) {
        console.error("WEBHOOK ERROR:", error.message);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
