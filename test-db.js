const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bqfvyrcnbgkzmwlmlhmu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnZ5cmNuYmdrem13bG1saG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzg4OTMsImV4cCI6MjA4NjY1NDg5M30.EXVdC6uD6pKpFV1DlCEY0xEWMjkGF9K6udhaYv8GkPs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testFetch() {
    console.log("Fetching all admissions...")
    const { data, error } = await supabase
        .from('admissions')
        .select('id, applicant_name')

    if (error) {
        console.error("Error:", error)
    } else {
        console.log("Found:", data.length, "admissions")
        data.forEach(a => console.log(`ID: ${a.id} | Name: ${a.applicant_name}`))
    }

    // Try to fetch one by specific ID if generic exists
    if (data && data.length > 0) {
        const testId = data[0].id
        console.log(`\nTesting single fetch for ID: ${testId}`)
        const { data: single, error: singleError } = await supabase
            .from('admissions')
            .select('*')
            .eq('id', testId)
            .single()

        if (singleError) console.error("Single Fetch Error:", singleError)
        else console.log("Single Fetch Success:", single.applicant_name)
    }
}

testFetch()
