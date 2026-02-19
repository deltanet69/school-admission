"use server"

import { supabase } from "@/lib/supabaseClient"
import { formatDistanceToNow } from "date-fns"
import { unstable_noStore as noStore } from "next/cache"

export type ActivityType = "registration" | "payment" | "approval" | "rejection" | "update" | "teacher_added" | "student_added"

export interface ActivityItem {
    id: string
    title: string
    description: string
    time: string
    timestamp: Date // For sorting
    type: ActivityType
    studentName?: string
    entityId: string
    slug?: string // Optional, for friendly URLs
}

export async function getRecentActivities(): Promise<ActivityItem[]> {
    noStore()
    const limit = 20
    const activities: ActivityItem[] = []

    // 1. Fetch Admissions (Registration, Payment, Approval, Rejection)
    const { data: admissions, error: admissionError } = await supabase
        .from('admissions')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(limit)

    if (!admissionError && admissions) {
        admissions.forEach(admission => {
            const created = new Date(admission.created_at)
            const updated = new Date(admission.updated_at)

            let type: ActivityType = "update"
            let title = "System Update"
            let description = `Update for ${admission.applicant_name}`
            let timestamp = updated

            // Determine event type
            const isNew = (updated.getTime() - created.getTime()) < 5 * 60 * 1000

            if (isNew) {
                type = "registration"
                title = "New Registration"
                description = `${admission.applicant_name} applied for ${admission.program_selection || 'Grade'}`
                timestamp = created
            } else if (admission.status === 'approved') {
                type = "approval"
                title = "Student Accepted"
                description = `${admission.applicant_name} has been approved`
            } else if (admission.status === 'rejected') {
                type = "rejection"
                title = "Application Rejected"
                description = `${admission.applicant_name} was rejected`
            } else if (admission.payment_status === 'verified' || admission.payment_status === 'paid') {
                type = "payment"
                title = "Payment Received"
                description = `Payment verified for ${admission.applicant_name}`
            }

            activities.push({
                id: `adm-${admission.id}`,
                title,
                description,
                time: formatDistanceToNow(timestamp, { addSuffix: true }),
                timestamp,
                type,
                studentName: admission.applicant_name,
                entityId: String(admission.id)
            })
        })
    }

    // 2. Fetch New Teachers
    const { data: teachers, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (!teacherError && teachers) {
        teachers.forEach(teacher => {
            const created = new Date(teacher.created_at)
            // Use slug if available, fallback to id
            const identifier = teacher.slug || String(teacher.id)

            activities.push({
                id: `tch-${teacher.id}`,
                title: "New Teacher",
                description: `${teacher.name} joined as ${teacher.subject_specialty || 'Teacher'}`,
                time: formatDistanceToNow(created, { addSuffix: true }),
                timestamp: created,
                type: "teacher_added",
                entityId: identifier,
                slug: teacher.slug || undefined
            })
        })
    }

    // 3. Fetch New Students (Directly added, not via admission)
    const { data: students, error: studentError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (!studentError && students) {
        students.forEach(student => {
            const created = new Date(student.created_at)
            const identifier = student.slug || String(student.id)

            activities.push({
                id: `std-${student.id}`,
                title: "New Student",
                description: `${student.name} enrolled in ${student.grade || 'School'}`,
                time: formatDistanceToNow(created, { addSuffix: true }),
                timestamp: created,
                type: "student_added",
                entityId: identifier,
                slug: student.slug || undefined
            })
        })
    }

    // 4. Fetch Updates/Announcements
    const { data: updates, error: updateError } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

    if (!updateError && updates) {
        updates.forEach(update => {
            const created = new Date(update.created_at)
            activities.push({
                id: `upd-${update.id}`,
                title: update.title,
                description: update.content.substring(0, 60) + (update.content.length > 60 ? '...' : ''),
                time: formatDistanceToNow(created, { addSuffix: true }),
                timestamp: created,
                type: "update",
                entityId: String(update.id)
            })
        })
    }

    // Sort by timestamp desc and take top 20
    return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 20)
}
