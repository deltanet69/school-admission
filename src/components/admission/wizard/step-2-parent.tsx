"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface StepProps {
    formData: any
    updateFormData: (data: any) => void
}

export function Step2Parent({ formData, updateFormData }: StepProps) {

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value })
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Parent/Guardian Data</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="p_name">Full Name</Label>
                    <Input
                        id="p_name"
                        placeholder="Parent's full name"
                        value={formData.parent_name}
                        onChange={(e) => handleChange("parent_name", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="p_edu">Highest Education</Label>
                    <Input
                        id="p_edu"
                        placeholder="e.g. Bachelor's Degree"
                        value={formData.parent_education}
                        onChange={(e) => handleChange("parent_education", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="p_job">Occupation</Label>
                    <Input
                        id="p_job"
                        placeholder="Current occupation"
                        value={formData.parent_occupation}
                        onChange={(e) => handleChange("parent_occupation", e.target.value)}
                    />
                </div>

                <div className="space-y-2 flex flex-col">
                    <Label>Date of Birth</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !formData.parent_dob && "text-muted-foreground"
                                )}
                            >
                                {formData.parent_dob ? (
                                    format(new Date(formData.parent_dob), "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={formData.parent_dob ? new Date(formData.parent_dob) : undefined}
                                onSelect={(date) => handleChange("parent_dob", date?.toISOString())}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                                captionLayout="dropdown"
                                fromYear={1960}
                                toYear={new Date().getFullYear()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="p_email">Email Address</Label>
                    <Input
                        id="p_email"
                        type="email"
                        placeholder="active@email.com"
                        value={formData.parent_email}
                        onChange={(e) => handleChange("parent_email", e.target.value)}
                    />
                    <p className="text-[0.8rem] text-muted-foreground">
                        Notifications regarding the admission process will be sent to this email.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="p_phone">Phone Number (WA Active)</Label>
                    <Input
                        id="p_phone"
                        placeholder="08..."
                        value={formData.parent_phone}
                        onChange={(e) => handleChange("parent_phone", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="p_income">Monthly Income</Label>
                    <Input
                        id="p_income"
                        placeholder="Approximate income"
                        value={formData.monthly_income}
                        onChange={(e) => handleChange("monthly_income", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="p_status">Status</Label>
                    <Select value={formData.parent_status} onValueChange={(v) => handleChange("parent_status", v)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Biological Parent">Biological Parent</SelectItem>
                            <SelectItem value="Guardian">Guardian</SelectItem>
                            <SelectItem value="Step Parent">Step Parent</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
