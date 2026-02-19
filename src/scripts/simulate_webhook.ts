import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const ORDER_ID = process.argv[2]; // Get order_id from command line arg
const STATUS = process.argv[3] || 'settlement'; // default to settlement (paid)

if (!SERVER_KEY) {
    console.error("Error: MIDTRANS_SERVER_KEY not found in .env.local");
    process.exit(1);
}

if (!ORDER_ID) {
    console.error("Usage: npx tsx src/scripts/simulate_webhook.ts <ORDER_ID> [STATUS]");
    console.error("Example: npx tsx src/scripts/simulate_webhook.ts ADM-123456-7890 settlement");
    process.exit(1);
}

const GROSS_AMOUNT = "500000"; // Fixed amount for now
const STATUS_CODE = "200";

const signature = crypto
    .createHash('sha512')
    .update(`${ORDER_ID}${STATUS_CODE}${GROSS_AMOUNT}${SERVER_KEY}`)
    .digest('hex');

const payload = {
    transaction_time: new Date().toISOString(),
    transaction_status: STATUS,
    transaction_id: `txn-${Date.now()}`,
    status_message: "midtrans payment notification",
    status_code: STATUS_CODE,
    signature_key: signature,
    payment_type: "bank_transfer",
    order_id: ORDER_ID,
    gross_amount: GROSS_AMOUNT,
    fraud_status: "accept",
    currency: "IDR"
};

async function sendWebhook() {
    try {
        console.log(`Sending ${STATUS} notification for Order ID: ${ORDER_ID}...`);
        console.log("Payload:", JSON.stringify(payload, null, 2));

        const response = await axios.post('http://localhost:3000/api/webhooks/midtrans', payload);

        console.log("Response:", response.status, response.data);
        console.log("✅ Webhook simulation successful!");
    } catch (error: any) {
        console.error("❌ Webhook failed:", error.response ? error.response.data : error.message);
    }
}

sendWebhook();
