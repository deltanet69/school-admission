import { supabase } from "@/lib/supabaseClient"
import { Student } from "@/types"
import { notFound } from "next/navigation"
import { StudentDetailClient } from "./student-detail-client"

export const revalidate = 0

async function getStudent(slugOrId: string): Promise<Student | null> {
    // Try by slug first
    let { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('slug', slugOrId)
        .single()

    // If not found by slug, try by ID (fallback for old links or if slug matches ID format)
    if (!data) {
        const { data: byId, error: byIdError } = await supabase
            .from('students')
            .select('*')
            .eq('id', slugOrId)
            .single()

        data = byId
    }

    if (!data) {
        return null
    }

    return data as Student
}

import { Suspense } from "react"

export default async function StudentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const student = await getStudent(slug)

    if (!student) {
        notFound()
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StudentDetailClient student={student} />
        </Suspense>
    )
}
