"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
// Import steps
import { Step1ProgramStudent } from "./step-1-program-student"
import { Step2Parent } from "./step-2-parent"
import { Step3Interests } from "./step-3-interests"
import { Step4Documents } from "./step-4-documents"
import { Step5Survey } from "./step-5-survey"
import { supabase } from "@/lib/supabaseClient"
import { Loader2, CheckCircle, CreditCard, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createPaymentTransaction } from "@/app/actions/payment"



export function AdmissionWizard() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
    const [formData, setFormData] = useState<any>({
        // Step 1
        program_selection: "",
        applicant_name: "",
        preferred_name: "",
        place_of_birth: "",
        date_of_birth: "",
        gender: "",
        religion: "",
        nationality: "",
        siblings_count: 0,
        // Step 2
        parent_name: "",
        parent_education: "",
        parent_occupation: "",
        parent_dob: "",
        parent_email: "",
        parent_phone: "",
        monthly_income: "",
        parent_status: "",
        // Step 3
        extracurricular_interests: [],
        special_needs: [],
        special_needs_note: "",
        // Step 4 (File Objects)
        file_birth_cert: null,
        file_family_card: null,
        file_photo: null,
        file_report: null,
        file_achievement_cert: null,
        file_recommendation_letter: null,
        // Step 5
        referral_source: "",
        declaration_agreed: false,
        policies_agreed: false,
        whatsapp_contact_consent: false,
    })

    const updateFormData = (newData: any) => {
        setFormData((prev: any) => ({ ...prev, ...newData }))
    }

    const totalSteps = 5
    const progress = (step / totalSteps) * 100

    const nextStep = () => {
        // Basic validation per step can be added here
        setStep(prev => Math.min(prev + 1, totalSteps))
        window.scrollTo(0, 0)
    }

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1))
        window.scrollTo(0, 0)
    }

    const uploadFile = async (file: File | null, path: string) => {
        if (!file) return null

        const fileExt = file.name.split('.').pop()
        const fileName = `${path}_${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('admission-docs')
            .upload(filePath, file)

        if (uploadError) {
            console.error(`Error uploading ${path}:`, uploadError)
            return null
        }

        // Get Public URL
        const { data } = supabase.storage
            .from('admission-docs')
            .getPublicUrl(filePath)

        return data.publicUrl
    }

    const handleSubmit = async () => {
        if (!formData.declaration_agreed) {
            alert("Please agree to the declaration to proceed.")
            return
        }

        setIsSubmitting(true)

        try {
            // 1. Upload Files
            const nameSlug = formData.applicant_name ? formData.applicant_name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'applicant'

            const documents = {
                birth_certificate: await uploadFile(formData.file_birth_cert, `${nameSlug}_birth_cert`),
                family_card: await uploadFile(formData.file_family_card, `${nameSlug}_family_card`),
                passport_photo: await uploadFile(formData.file_photo, `${nameSlug}_photo`),
                latest_report: await uploadFile(formData.file_report, `${nameSlug}_report`),
                achievement_cert: await uploadFile(formData.file_achievement_cert, `${nameSlug}_ach_cert`),
                recommendation_letter: await uploadFile(formData.file_recommendation_letter, `${nameSlug}_rec_letter`),
            }

            // 2. Prepare Data Payload
            const payload = {
                applicant_name: formData.applicant_name,
                preferred_name: formData.preferred_name,
                place_of_birth: formData.place_of_birth,
                date_of_birth: formData.date_of_birth,
                gender: formData.gender,
                religion: formData.religion,
                nationality: formData.nationality,
                siblings_count: formData.siblings_count,

                parent_name: formData.parent_name,
                parent_education: formData.parent_education,
                parent_occupation: formData.parent_occupation,
                parent_email: formData.parent_email,
                parent_phone: formData.parent_phone,
                monthly_income: formData.monthly_income,

                email: formData.parent_email,
                phone: formData.parent_phone,

                program_selection: formData.program_selection,

                documents: documents,
                extracurricular_interests: formData.extracurricular_interests,
                special_needs: formData.special_needs,
                special_needs_note: formData.special_needs_note,

                status: 'pending',
                submission_date: new Date().toISOString(),
                referral_source: formData.referral_source,
                declaration_agreed: formData.declaration_agreed
            }

            // Insert into DB
            const { data: newAdmission, error } = await supabase
                .from('admissions')
                .insert([payload])
                .select()
                .single()

            if (error) throw error

            // 3. Create Payment Transaction
            if (newAdmission && newAdmission.id) {
                const paymentResult = await createPaymentTransaction(
                    newAdmission.id,
                    formData.applicant_name,
                    formData.parent_email,
                    formData.parent_phone
                )

                if (paymentResult.success && paymentResult.paymentUrl) {
                    setPaymentUrl(paymentResult.paymentUrl)
                } else {
                    console.error("Payment creation failed:", paymentResult.error)
                    // We still show success but maybe warn about payment
                }
            }

            setIsSuccess(true)

        } catch (error: any) {
            console.error("Submission error:", error)
            alert(`Failed to submit application: ${error.message || JSON.stringify(error)}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Application Submitted!</h2>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        Thank you for applying to Horizon Academy. We have received your data.
                    </p>
                </div>

                {paymentUrl ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-lg mx-auto mt-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Registration Fee Payment</h3>
                        <p className="text-blue-700 text-sm mb-4">
                            To complete your registration process, please proceed with the payment of <strong>IDR 500.000</strong>.
                        </p>
                        <Link href={paymentUrl} target="_blank">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold shadow-lg shadow-blue-200">
                                <CreditCard className="mr-2 h-5 w-5" /> Pay Now
                            </Button>
                        </Link>
                        <p className="text-xs text-blue-600 mt-3">
                            Check your email for payment confirmation and further instructions.
                        </p>
                    </div>
                ) : (
                    <div className="pt-6">
                        <p className="text-sm text-yellow-600 mb-4 bg-yellow-50 p-3 rounded-md">
                            ⚠️ Payment link could not be generated automatically. Please check your email for manual instructions.
                        </p>
                        <Link href="/">
                            <Button variant="outline">Back to Home</Button>
                        </Link>
                    </div>
                )}
            </div>
        )
    }

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1ProgramStudent formData={formData} updateFormData={updateFormData} />
            case 2: return <Step2Parent formData={formData} updateFormData={updateFormData} />
            case 3: return <Step3Interests formData={formData} updateFormData={updateFormData} />
            case 4: return <Step4Documents formData={formData} updateFormData={updateFormData} />
            case 5: return <Step5Survey formData={formData} updateFormData={updateFormData} />
            default: return null
        }
    }

    return (
        <div className="space-y-8 pb-5">
            {/* Progress Indicator */}
            <div className="space-y-1">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Step {step} of {totalSteps}</span>
                    <span>{Math.round(progress)}% Completed</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Form Step Content */}
            <div className="min-h-[400px]">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t fixed bottom-0 right-0 w-full lg:w-1/2 bg-white p-6 border-l shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 transition-all">
                <div className="flex w-full max-w-3xl mx-auto justify-between px-6 lg:px-12">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 1 || isSubmitting}
                        className="w-32"
                    >
                        Previous
                    </Button>

                    {step < totalSteps ? (
                        <Button
                            onClick={nextStep}
                            className="w-32 bg-blue-600 hover:bg-blue-700"
                        >
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !formData.declaration_agreed}
                            className="w-32 bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : "Submit & Pay"}
                        </Button>
                    )}
                </div>
            </div>
            {/* Spacer for fixed bottom bar */}
            <div className="h-20" />
        </div>
    )
}
