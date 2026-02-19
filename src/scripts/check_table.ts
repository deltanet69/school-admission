import { createClient } from '@supabase/supabase-js'

// Hardcoded for script execution context
const supabaseUrl = "https://bqfvyrcnbgkzmwlmlhmu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnZ5cmNuYmdrem13bG1saG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzg4OTMsImV4cCI6MjA4NjY1NDg5M30.EXVdC6uD6pKpFV1DlCEY0xEWMjkGF9K6udhaYv8GkPs"
const supabase = createClient(supabaseUrl, supabaseKey)

const tableName = process.argv[2]

async function main() {
    console.log(`Checking table: ${tableName}`)
    const { data, error } = await supabase.from(tableName).select('count(*)', { count: 'exact', head: true })

    if (error) {
        console.error(`Error checking table:`, error.message)
    } else {
        console.log(`Table '${tableName}' exists.`)
    }
}

main()
