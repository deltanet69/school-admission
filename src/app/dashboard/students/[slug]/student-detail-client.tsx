"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Student } from "@/types"
import { useState } from "react"
import { StudentModal } from "@/components/students/student-modal"
import { supabase } from "@/lib/supabaseClient"
import { StudentDetailContent } from "@/components/students/student-detail-content"
import { useSearchParams } from "next/navigation"

/* eslint-disable @next/next/no-img-element */

interface StudentDetailClientProps {
    student: Student
}

export function StudentDetailClient({ student }: StudentDetailClientProps) {
    const [imgError, setImgError] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const searchParams = useSearchParams()
    const returnTo = searchParams.get('returnTo')

    return (
        <div className="space-y-6 mx-4 md:mx-8 lg:mx-20">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href={returnTo || "/dashboard/students"}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight">Student Details</h2>
                </div>
                <div className="hidden md:flex space-x-2">
                    <Button onClick={() => setShowEditModal(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Student
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            if (confirm("Are you sure you want to delete this student?")) {
                                const { error } = await supabase.from("students").delete().eq("id", student.id)
                                if (error) {
                                    alert("Error deleting student: " + error.message)
                                } else {
                                    window.location.href = "/dashboard/students"
                                }
                            }
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </div>

            <StudentModal
                student={student}
                open={showEditModal}
                onOpenChange={setShowEditModal}
                trigger={null}
            />

            {/* Reusable Content Component */}
            <StudentDetailContent student={student} />

            {/* Mobile Actions (Bottom) */}
            <div className="md:hidden mt-6 pb-6">
                <div className="flex flex-col gap-3">
                    <Button className="w-full" onClick={() => setShowEditModal(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Student
                    </Button>
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={async () => {
                            if (confirm("Are you sure you want to delete this student?")) {
                                const { error } = await supabase.from("students").delete().eq("id", student.id)
                                if (error) {
                                    alert("Error deleting student: " + error.message)
                                } else {
                                    window.location.href = "/dashboard/students"
                                }
                            }
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Student
                    </Button>
                </div>
            </div>
        </div>
    )
}
