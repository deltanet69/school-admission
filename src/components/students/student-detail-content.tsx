"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Calendar, MapPin, Phone, GraduationCap, Mail, IdCard } from "lucide-react"
import { Student } from "@/types"
import { useState } from "react"
import { StudentIdCard } from "@/components/students/student-id-card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

/* eslint-disable @next/next/no-img-element */

interface StudentDetailContentProps {
    student: Student
}

export function StudentDetailContent({ student }: StudentDetailContentProps) {
    const [imgError, setImgError] = useState(false)

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column: Fixed Profile Card */}
            <Card className="md:col-span-1 w-full overflow-hidden h-fit">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-4">
                    <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-2 border-primary mx-auto">
                        {student.profile_picture && !imgError ? (
                            <img
                                src={student.profile_picture}
                                alt={student.name}
                                className="h-full w-full object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                <User className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{student.grade}</p>
                        <div className="mt-2 text-xs font-mono bg-muted px-2 py-1 rounded inline-block">
                            NIS: {student.nis}
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${student.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {student.status.toUpperCase()}
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full gap-2 mt-4">
                                <IdCard className="h-4 w-4" />
                                Student ID Card
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Student ID Card</DialogTitle>
                                <DialogDescription>
                                    Preview and download the student identity card.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 flex justify-center bg-gray-50/50 p-4 rounded-lg">
                                <StudentIdCard student={student} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Right Column: Details Stack */}
            <div className="md:col-span-2 space-y-6">

                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <Mail className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Email</p>
                                    <p className="text-md font-medium">{student.email || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <Phone className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Phone</p>
                                    <p className="text-md font-medium">{student.phone || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <User className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Gender</p>
                                    <p className="text-md font-medium">{student.gender || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <Calendar className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Date of Birth</p>
                                    <p className="text-md font-medium">
                                        {student.place_of_birth ? `${student.place_of_birth}, ` : ""}
                                        {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20 md:col-span-2">
                                <MapPin className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Address</p>
                                    <p className="text-md font-medium">{student.address || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Academic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Academic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                                <GraduationCap className="h-8 w-8 text-blue-700" />
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase">Current Grade</p>
                                    <p className="text-lg font-bold text-gray-900">{student.grade}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                                <Calendar className="h-8 w-8 text-purple-700" />
                                <div>
                                    <p className="text-xs text-purple-600 font-bold uppercase">Enrollment Year</p>
                                    <p className="text-lg font-bold text-gray-900">{student.enrollment_year || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Parent Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Parent Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <User className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Parent Name</p>
                                    <p className="text-md font-medium">{student.parent_name || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <Phone className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Parent Phone</p>
                                    <p className="text-md font-medium">{student.parent_phone || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <Mail className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Parent Email</p>
                                    <p className="text-md font-medium">{student.parent_email || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                                <Calendar className="h-7 w-7 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Parent DOB</p>
                                    <p className="text-md font-medium">
                                        {student.parent_dob ? new Date(student.parent_dob).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

