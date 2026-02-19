import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkIds() {
    console.log("Checking Admissions...")
    const { data: adm } = await supabase.from('admissions').select('id').limit(1)
    console.log('Admissions ID:', adm)

    console.log("Checking Teachers...")
    const { data: tch } = await supabase.from('teachers').select('id').limit(1)
    console.log('Teachers ID:', tch)

    console.log("Checking Students...")
    const { data: std } = await supabase.from('students').select('id').limit(1)
    console.log('Students ID:', std)
}

checkIds()
