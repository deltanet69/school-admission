"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Image as ImageIcon, Upload } from "lucide-react"

interface StepProps {
    formData: any
    updateFormData: (data: any) => void
}

export function Step4Documents({ formData, updateFormData }: StepProps) {

    // Handler for file inputs
    const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Store the File object directly in state
            // Note: We'll handle the actual upload in the final submit step
            updateFormData({ [field]: e.target.files[0] })
        }
    }

    // Helper to show selected filename
    const getFileName = (field: string) => {
        const file = formData[field]
        if (file instanceof File) return file.name
        return ""
    }

    return (
        <div className="space-y-8">
            {/* Mandatory Documents */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Mandatory Documents</h3>
                <p className="text-xs text-muted-foreground -mt-2">Upload scan/photo, max 2MB, JPG/PDF format</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                        <Label htmlFor="birth_cert">Birth Certificate</Label>
                        <div className="relative">
                            <Input
                                id="birth_cert"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileChange("file_birth_cert", e)}
                                className="pl-10 cursor-pointer"
                            />
                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        {getFileName("file_birth_cert") && (
                            <p className="text-xs text-green-600 truncate">Selected: {getFileName("file_birth_cert")}</p>
                        )}
                    </div>

                    <div className="space-y-2 relative">
                        <Label htmlFor="family_card">Family Card (Kartu Keluarga)</Label>
                        <div className="relative">
                            <Input
                                id="family_card"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileChange("file_family_card", e)}
                                className="pl-10 cursor-pointer"
                            />
                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        {getFileName("file_family_card") && (
                            <p className="text-xs text-green-600 truncate">Selected: {getFileName("file_family_card")}</p>
                        )}
                    </div>

                    <div className="space-y-2 relative">
                        <Label htmlFor="photo">Passport Photo 3x4</Label>
                        <div className="relative">
                            <Input
                                id="photo"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange("file_photo", e)}
                                className="pl-10 cursor-pointer"
                            />
                            <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        {getFileName("file_photo") && (
                            <p className="text-xs text-green-600 truncate">Selected: {getFileName("file_photo")}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground">*red/white background</p>
                    </div>

                    <div className="space-y-2 relative">
                        <Label htmlFor="report">Latest Report (Rapor Terakhir)</Label>
                        <div className="relative">
                            <Input
                                id="report"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileChange("file_report", e)}
                                className="pl-10 cursor-pointer"
                            />
                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        {getFileName("file_report") && (
                            <p className="text-xs text-green-600 truncate">Selected: {getFileName("file_report")}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Optional Documents */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Optional Documents</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                        <Label htmlFor="certs">Achievement Certificates</Label>
                        <div className="relative">
                            <Input
                                id="certs"
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileChange("file_achievement_cert", e)}
                                className="pl-10 cursor-pointer"
                            />
                            <Upload className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        {getFileName("file_achievement_cert") && (
                            <p className="text-xs text-green-600 truncate">Selected: {getFileName("file_achievement_cert")}</p>
                        )}
                    </div>

                    <div className="space-y-2 relative">
                        <Label htmlFor="recommendation">Recommendation Letters (if any)</Label>
                        <div className="relative">
                            <Input
                                id="recommendation"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileChange("file_recommendation_letter", e)}
                                className="pl-10 cursor-pointer"
                            />
                            <Upload className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        {getFileName("file_recommendation_letter") && (
                            <p className="text-xs text-green-600 truncate">Selected: {getFileName("file_recommendation_letter")}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
