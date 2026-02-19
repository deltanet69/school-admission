const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bqfvyrcnbgkzmwlmlhmu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnZ5cmNuYmdrem13bG1saG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzg4OTMsImV4cCI6MjA4NjY1NDg5M30.EXVdC6uD6pKpFV1DlCEY0xEWMjkGF9K6udhaYv8GkPs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
    console.log("Fetching one admission to check structure...")
    const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .limit(1)

    if (error) {
        console.error("Error:", error)
    } else if (data && data.length > 0) {
        const record = data[0]
        console.log("Keys found:", Object.keys(record))
        console.log("Documents value:", record.documents)
        console.log("Referral Source:", record.referral_source)
    } else {
        console.log("No admissions found to check.")
    }
}

checkSchema()
