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

export function Step1ProgramStudent({ formData, updateFormData }: StepProps) {

    const handleChange = (field: string, value: any) => {
        updateFormData({ [field]: value })
    }

    return (
        <div className="space-y-6">
            {/* Program Selection */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Programs Information</h3>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="program">Select programs</Label>
                        <Select value={formData.program_selection} onValueChange={(v) => handleChange("program_selection", v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pre-school p1">Pre-school p1</SelectItem>
                                <SelectItem value="Pre-school p2">Pre-school p2</SelectItem>
                                <SelectItem value="Kindergarten K1">Kindergarten K1</SelectItem>
                                <SelectItem value="Kindergarten K2">Kindergarten K2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Student Data */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Student Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                            id="fullname"
                            placeholder="Student's full name"
                            value={formData.applicant_name}
                            onChange={(e) => handleChange("applicant_name", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="preferred">Preferred name</Label>
                        <Input
                            id="preferred"
                            placeholder="Nickname (Optional)"
                            value={formData.preferred_name}
                            onChange={(e) => handleChange("preferred_name", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pob">Place of Birth</Label>
                        <Input
                            id="pob"
                            placeholder="City of birth"
                            value={formData.place_of_birth}
                            onChange={(e) => handleChange("place_of_birth", e.target.value)}
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
                                        !formData.date_of_birth && "text-muted-foreground"
                                    )}
                                >
                                    {formData.date_of_birth ? (
                                        format(new Date(formData.date_of_birth), "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.date_of_birth ? new Date(formData.date_of_birth) : undefined}
                                    onSelect={(date) => handleChange("date_of_birth", date?.toISOString())}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    captionLayout="dropdown"
                                    fromYear={2015}
                                    toYear={new Date().getFullYear()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(v) => handleChange("gender", v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="religion">Religion</Label>
                        <Select value={formData.religion} onValueChange={(v) => handleChange("religion", v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select religion" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Islam">Islam</SelectItem>
                                <SelectItem value="Protestant Christianity">Protestant Christianity</SelectItem>
                                <SelectItem value="Catholic Christianity">Catholic Christianity</SelectItem>
                                <SelectItem value="Hinduism">Hinduism</SelectItem>
                                <SelectItem value="Buddhism">Buddhism</SelectItem>
                                <SelectItem value="Confucianism">Confucianism</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Select value={formData.nationality} onValueChange={(v) => handleChange("nationality", v)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Indonesia">Indonesia</SelectItem>
                                <SelectItem value="Foreign">Foreign</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siblings">Number of Siblings</Label>
                        <Input
                            id="siblings"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.siblings_count}
                            onChange={(e) => handleChange("siblings_count", parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
