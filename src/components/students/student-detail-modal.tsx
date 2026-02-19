"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Student } from "@/types"
import { StudentDetailContent } from "./student-detail-content"

interface StudentDetailModalProps {
    student: Student | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StudentDetailModal({ student, open, onOpenChange }: StudentDetailModalProps) {
    if (!student) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Student Details: {student.name}</DialogTitle>
                </DialogHeader>
                <StudentDetailContent student={student} />
            </DialogContent>
        </Dialog>
    )
}
