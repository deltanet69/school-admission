import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSlug() {
    console.log("Checking for slug column...")
    const { data, error } = await supabase.from('students').select('slug').limit(1)

    if (error) {
        console.log("Error checking slug (likely doesn't exist):", error.message)
    } else {
        console.log("Slug column exists!")
    }
}

checkSlug()
