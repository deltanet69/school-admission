"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"

interface StepProps {
    formData: any
    updateFormData: (data: any) => void
}

export function Step3Interests({ formData, updateFormData }: StepProps) {

    // Helper to toggle item in array
    const toggleArrayItem = (field: string, item: string) => {
        const currentArray = formData[field] || []
        if (currentArray.includes(item)) {
            updateFormData({ [field]: currentArray.filter((i: string) => i !== item) })
        } else {
            updateFormData({ [field]: [...currentArray, item] })
        }
    }

    const interests = ["Quran Tahfidz", "Arabic Language", "English Language", "Science Club", "Robotics", "Music/Art"]
    const specialNeeds = ["Special Needs", "Allergies/Dietary", "Medical Conditions"]

    return (
        <div className="space-y-8">
            {/* Extracurriculars */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Extracurricular Interests:</h3>
                <p className="text-xs text-muted-foreground -mt-2">Select as many as apply</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interests.map((interest) => (
                        <div
                            key={interest}
                            onClick={() => toggleArrayItem("extracurricular_interests", interest)}
                            className={`
                                cursor-pointer border rounded-md p-3 text-center text-sm font-medium transition-all
                                ${formData.extracurricular_interests?.includes(interest)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-white text-gray-700 hover:bg-gray-50"}
                            `}
                        >
                            {interest}
                        </div>
                    ))}
                </div>
            </div>

            {/* Special Needs */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Special Needs (if applicable)</h3>
                <p className="text-xs text-muted-foreground -mt-2">Please select if any apply</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {specialNeeds.map((need) => (
                        <div
                            key={need}
                            onClick={() => toggleArrayItem("special_needs", need)}
                            className={`
                                cursor-pointer border rounded-md p-3 text-center text-sm font-medium transition-all
                                ${formData.special_needs?.includes(need)
                                    ? "bg-blue-100 text-blue-900 border-blue-300"
                                    : "bg-white text-gray-700 hover:bg-gray-50"}
                            `}
                        >
                            {need}
                        </div>
                    ))}
                </div>

                <div className="space-y-2 mt-4">
                    <Label htmlFor="note">Notes / Explanation (Optional)</Label>
                    <Textarea
                        id="note"
                        placeholder="Please explain any selected conditions..."
                        value={formData.special_needs_note}
                        onChange={(e) => updateFormData({ special_needs_note: e.target.value })}
                        className="min-h-[100px]"
                    />
                </div>
            </div>
        </div>
    )
}
