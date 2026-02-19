import { createClient } from '@supabase/supabase-js'

// Hardcoded for script execution context
const supabaseUrl = "https://bqfvyrcnbgkzmwlmlhmu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnZ5cmNuYmdrem13bG1saG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzg4OTMsImV4cCI6MjA4NjY1NDg5M30.EXVdC6uD6pKpFV1DlCEY0xEWMjkGF9K6udhaYv8GkPs"
const supabase = createClient(supabaseUrl, supabaseKey)

function generateBaseSlug(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with dashes
}

async function processTable(tableName: string) {
    console.log(`Processing ${tableName}...`)
    const { data: records, error } = await supabase.from(tableName).select('id, name')

    if (error) {
        console.error(`Error fetching ${tableName}:`, error)
        return
    }

    const slugMap = new Map<string, number>()

    for (const record of records) {
        const baseSlug = generateBaseSlug(record.name)
        let finalSlug = baseSlug

        // Check for duplicates in our local map
        if (slugMap.has(baseSlug)) {
            const count = slugMap.get(baseSlug)! + 1
            slugMap.set(baseSlug, count)
            finalSlug = `${baseSlug}-${count}`
        } else {
            slugMap.set(baseSlug, 1)
        }

        // Update DB
        const { error: updateError } = await supabase
            .from(tableName)
            .update({ slug: finalSlug })
            .eq('id', record.id)

        if (updateError) {
            console.error(`Failed to update ${tableName} ${record.name}:`, updateError)
        } else {
            console.log(`Updated ${tableName}: ${record.name} -> ${finalSlug}`)
        }
    }
}

async function main() {
    await processTable('teachers')
    await processTable('students')
    await processTable('classrooms')
    console.log("All done!")
}

main()
