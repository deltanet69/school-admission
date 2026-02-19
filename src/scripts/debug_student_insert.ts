import { supabase } from '@/lib/supabaseClient';

async function debugStudentInsert() {
    console.log("Checking students table info...");

    // 1. Check constraints by trying to insert a dummy record with only required fields (known so far)
    // We'll intentionally fail to commit if possible, or just insert and delete.
    // Actually, better to inspect the error.

    const testStudent = {
        name: "Debug Student",
        nis: "DEBUG-" + Date.now(),
        grade: "Kindergarten K1",
        status: "active"
    };

    const { data, error } = await supabase
        .from('students')
        .insert([testStudent])
        .select();

    if (error) {
        console.error("Insertion Failed:", error);
        // If error mentions user_id, that's it.
    } else {
        console.log("Insertion Success:", data);
        // Clean up
        if (data && data[0]) {
            await supabase.from('students').delete().eq('id', data[0].id);
            console.log("Cleaned up debug record.");
        }
    }

    // 2. Check Classrooms
    const { data: classrooms, error: classError } = await supabase.from('classrooms').select('id, name');
    if (classError) console.error("Classroom fetch error:", classError);
    else console.log("Classrooms:", JSON.stringify(classrooms, null, 2));
}

debugStudentInsert();
