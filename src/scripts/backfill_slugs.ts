import { createClient } from '@supabase/supabase-js'

// Hardcoded for script execution context where process.env is not loaded automatically
const supabaseUrl = "https://bqfvyrcnbgkzmwlmlhmu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnZ5cmNuYmdrem13bG1saG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzg4OTMsImV4cCI6MjA4NjY1NDg5M30.EXVdC6uD6pKpFV1DlCEY0xEWMjkGF9K6udhaYv8GkPs"
const supabase = createClient(supabaseUrl, supabaseKey)

function generateSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with dashes
        + '-' + Math.random().toString(36).substring(2, 7) // Add random suffix for uniqueness
}

async function backfill() {
    console.log("Starting backfill...")

    // 1. Teachers
    const { data: teachers } = await supabase.from('teachers').select('id, name, slug')
    if (teachers) {
        for (const teacher of teachers) {
            if (!teacher.slug) {
                const slug = generateSlug(teacher.name)
                const { error } = await supabase
                    .from('teachers')
                    .update({ slug })
                    .eq('id', teacher.id)

                if (error) console.error(`Failed to update teacher ${teacher.name}:`, error)
                else console.log(`Updated teacher: ${teacher.name} -> ${slug}`)
            } else {
                console.log(`Teacher ${teacher.name} already has slug: ${teacher.slug}`)
            }
        }
    }

    // 2. Students
    const { data: students } = await supabase.from('students').select('id, name, slug')
    if (students) {
        for (const student of students) {
            if (!student.slug) {
                const slug = generateSlug(student.name)
                const { error } = await supabase
                    .from('students')
                    .update({ slug })
                    .eq('id', student.id)

                if (error) console.error(`Failed to update student ${student.name}:`, error)
                else console.log(`Updated student: ${student.name} -> ${slug}`)
            } else {
                console.log(`Student ${student.name} already has slug: ${student.slug}`)
            }
        }
    }

    console.log("Backfill complete.")
}

backfill()
