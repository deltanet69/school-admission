import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
    isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

console.log("---------------------------------------------------")
console.log("MIDTRANS CLIENT INITIALIZED")
console.log("Is Production:", process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true')
console.log("Server Key Present:", !!process.env.MIDTRANS_SERVER_KEY)
console.log("Client Key Present:", !!process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY)
console.log("---------------------------------------------------")

export default snap;
