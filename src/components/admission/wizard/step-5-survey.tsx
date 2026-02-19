"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

interface StepProps {
    formData: any
    updateFormData: (data: any) => void
}

export function Step5Survey({ formData, updateFormData }: StepProps) {

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value })
    }

    const sources = ["Social Media", "Friends", "Website", "Ads Interest", "Events", "Others"]

    return (
        <div className="space-y-8">
            {/* Survey */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">How did you learn about Horizon Academy?</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sources.map((source) => (
                        <div
                            key={source}
                            onClick={() => handleChange("referral_source", source)}
                            className={`
                                cursor-pointer border rounded-md p-3 text-center text-sm font-medium transition-all
                                ${formData.referral_source === source
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"}
                            `}
                        >
                            {source}
                        </div>
                    ))}
                </div>
            </div>

            {/* Declaration & Consent */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Declaration & Consent</h3>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2 border p-3 rounded-lg bg-gray-50/50">
                        <Switch
                            id="declaration"
                            checked={formData.declaration_agreed}
                            onCheckedChange={(v) => handleChange("declaration_agreed", v)}
                        />
                        <Label htmlFor="declaration" className="text-sm font-normal cursor-pointer">
                            I declare that all information provided is true and accurate
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-lg bg-gray-50/50">
                        <Switch
                            id="policies"
                            checked={formData.policies_agreed}
                            onCheckedChange={(v) => handleChange("policies_agreed", v)}
                        />
                        <Label htmlFor="policies" className="text-sm font-normal cursor-pointer">
                            I agree to comply with all school policies and procedures
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-lg bg-gray-50/50">
                        <Switch
                            id="whatsapp"
                            checked={formData.whatsapp_contact_consent}
                            onCheckedChange={(v) => handleChange("whatsapp_contact_consent", v)}
                        />
                        <Label htmlFor="whatsapp" className="text-sm font-normal cursor-pointer">
                            I consent to be contacted via WhatsApp for further information
                        </Label>
                    </div>
                </div>

                {/* Visual Captcha Placeholder */}
                <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 p-4 border rounded-lg max-w-[300px] bg-white shadow-sm">
                        <div className="h-6 w-6 border-2 border-gray-300 rounded-sm" />
                        <span className="text-sm text-gray-600">I'm not a robot</span>
                        <div className="ml-auto w-10 flex flex-col items-center justify-center text-[8px] text-gray-400">
                            <div className="h-6 w-6 rounded-full border-2 border-gray-300 mb-1" />
                            reCAPTCHA
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
