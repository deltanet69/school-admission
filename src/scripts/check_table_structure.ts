
import { supabase } from "@/lib/supabaseClient"

async function checkStructure() {
    console.log("Checking Teachers Table...")
    const { data: teachers, error: teacherError } = await supabase.from('teachers').select('*').limit(1)
    if (teacherError) console.error(teacherError)
    else console.log("Teachers keys:", teachers && teachers.length > 0 ? Object.keys(teachers[0]) : "No data")

    console.log("Checking Students Table...")
    const { data: students, error: studentError } = await supabase.from('students').select('*').limit(1)
    if (studentError) console.error(studentError)
    else console.log("Students keys:", students && students.length > 0 ? Object.keys(students[0]) : "No data")
}

checkStructure()
