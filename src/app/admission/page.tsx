import Image from "next/image"
import { AdmissionWizard } from "@/components/admission/wizard/admission-wizard"

export const metadata = {
    title: "Online Admission | Horizon Academy",
    description: "Join Horizon Academy - Student Admission for Academic Year 2026/2027",
}

export default function PublicAdmissionPage() {
    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-blue-900 text-white flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/admissionbg.png"
                        alt="Admission Background"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
                </div>

                <div className="relative z-10 text-center px-12">
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">Online Admission</h1>
                    <p className="text-xl font-light text-blue-100 mb-8">Let&apos;s be a part of us</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto h-screen">
                <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 lg:px-12 flex flex-col justify-center">

                    {/* Header Mobile Only */}
                    <div className="lg:hidden mb-8 text-center">
                        <h1 className="text-3xl font-bold text-primary">Online Admission</h1>
                        <p className="text-muted-foreground">Let&apos;s be a part of us</p>
                    </div>

                    {/* Logo & Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Image
                                src="/logo2.png"
                                alt="Horizon Academy Logo"
                                width={48}
                                height={48}
                                className="h-12 w-auto object-contain"
                            />
                            <div>
                                <h2 className="font-bold text-xl text-primary leading-none">Horizon Academy</h2>
                                <p className="text-xs text-muted-foreground">Bright Minds, Brighter Futures</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Horizon Online Admission</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Student Admission for Academic Year 2026/2027 - horizonacademy.id
                            </p>
                        </div>
                    </div>

                    {/* Wizard Form */}
                    <AdmissionWizard />

                </div>
            </div>
        </div>
    )
}
