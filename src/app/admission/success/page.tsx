import Link from 'next/link'
import { CheckCircle, Download, Printer, Share2, Calendar, Mail, CreditCard, ArrowLeft, XCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

export const revalidate = 0

async function getPaymentData(orderId: string) {
    const { data: admission, error } = await supabase
        .from('admissions')
        .select('*')
        .eq('order_id', orderId)
        .single()

    if (error || !admission) {
        console.error("Error fetching admission by order_id:", error)
        return null
    }

    return {
        orderId: admission.order_id || '-',
        date: new Date(admission.created_at).toLocaleString('id-ID', {
            dateStyle: 'long',
            timeStyle: 'medium'
        }),
        amount: admission.amount ? admission.amount.toLocaleString('id-ID') : '500.000',
        method: 'Midtrans Payment', // We might not get the exact method without querying Midtrans API status
        studentName: admission.applicant_name,
        status: admission.payment_status || 'pending',
        items: [
            { name: `Biaya Pendaftaran PPDB 2026/2027 - ${admission.program_selection}`, qty: 1, price: admission.amount || 500000 }
        ]
    }
}

export default async function AdmissionSuccessPage(props: { searchParams: Promise<{ order_id?: string; transaction_status?: string }> }) {
    const searchParams = await props.searchParams
    const orderId = searchParams.order_id

    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Order ID Not Found</h1>
                    <p className="text-gray-600 mt-2">Invalid payment callback parameters.</p>
                    <Link href="/">
                        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Return Home
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    const paymentData = await getPaymentData(orderId)

    if (!paymentData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Admission Data Not Found</h1>
                    <p className="text-gray-600 mt-2">Could not verify payment details for Order ID: {orderId}</p>
                    <Link href="/">
                        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Return Home
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    const isPending = paymentData.status === 'pending'
    const isFailed = paymentData.status === 'failed'

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements - Pure Tailwind */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            </div>

            <div className="max-w-4xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-8 animate-[fadeIn_0.6s_ease-out]">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-bounce 
                        ${isFailed ? 'bg-red-100' : isPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
                        {isFailed ? <XCircle className="w-10 h-10 text-red-600" /> :
                            isPending ? <Calendar className="w-10 h-10 text-yellow-600" /> :
                                <CheckCircle className="w-10 h-10 text-green-600" />}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {isFailed ? 'Payment Failed' : isPending ? 'Payment Pending/Processing' : 'Payment Successful!'}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {isFailed ? 'Mohon maaf, pembayaran Anda gagal.' :
                            isPending ? 'Pembayaran Anda sedang kami verifikasi.' :
                                <>Terima kasih, <span className="font-semibold text-gray-900">{paymentData.studentName}</span>. Pembayaran Anda telah kami terima.</>}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8 animate-[fadeIn_0.8s_ease-out]">
                    {/* Status Bar */}
                    <div className={`px-6 py-3 ${isFailed ? 'bg-red-500' : isPending ? 'bg-yellow-500' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
                        <div className="flex items-center justify-between text-white">
                            <span className="font-medium flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                {isFailed ? 'Transaksi Gagal' : isPending ? 'Menunggu Konfirmasi' : 'Transaksi Berhasil'}
                            </span>
                            <span className="text-sm opacity-90 font-mono">ID: {paymentData.orderId}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {/* Order Summary */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-500" />
                                Ringkasan Pembayaran
                            </h2>

                            <div className="bg-gray-50 rounded-2xl p-6">
                                <div className="space-y-4">
                                    {paymentData.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center group hover:bg-white p-2 rounded-lg transition-colors">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.qty} x Rp {item.price.toLocaleString()}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                Rp {item.price.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">Total</span>
                                        <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                            Rp {paymentData.amount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-blue-50 rounded-xl p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">Waktu Pembayaran</span>
                                </div>
                                <p className="text-gray-900 font-semibold pl-11">{paymentData.date}</p>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">Metode Pembayaran</span>
                                </div>
                                <p className="text-gray-900 font-semibold pl-11">{paymentData.method}</p>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8 relative overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 relative z-10">
                                <Mail className="w-5 h-5" />
                                Langkah Selanjutnya
                            </h3>
                            <ul className="space-y-3 text-sm relative z-10">
                                <li className="flex items-start gap-3 group/item">
                                    <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 group-hover/item:bg-white group-hover/item:text-blue-600 transition-colors">
                                        1
                                    </span>
                                    <span className="group-hover/item:translate-x-1 transition-transform">
                                        Email konfirmasi akan dikirim ke alamat email Anda dalam 1x24 jam
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 group/item">
                                    <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 group-hover/item:bg-white group-hover/item:text-blue-600 transition-colors">
                                        2
                                    </span>
                                    <span className="group-hover/item:translate-x-1 transition-transform">
                                        Admin akan memproses pendaftaran dan mengirimkan informasi lebih lanjut via WhatsApp
                                    </span>
                                </li>
                                <li className="flex items-start gap-3 group/item">
                                    <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 group-hover/item:bg-white group-hover/item:text-blue-600 transition-colors">
                                        3
                                    </span>
                                    <span className="group-hover/item:translate-x-1 transition-transform">
                                        Jika ada pertanyaan, silakan hubungi kami di +62 21 1234 5678
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="flex gap-2">
                                <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110">
                                    <Printer className="w-5 h-5" />
                                </button>
                                <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            <Link
                                href="/"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all shadow-lg hover:shadow-xl gap-2 group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-500 mt-6 animate-[fadeIn_1s_ease-out]">
                    Email konfirmasi telah dikirim ke email Anda. Cek folder spam jika tidak ada.
                </p>
            </div>
        </div>
    )
}