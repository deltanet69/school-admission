import { supabase } from '@/lib/supabaseClient';

async function checkStudentSchema() {
    // Try to insert a dummy record to see constraints or just select a record to see keys
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching students:', error);
    } else {
        // Log keys of the first record if exists, otherwise we might need another way or just assume based on error
        if (data && data.length > 0) {
            console.log('Student Columns:', Object.keys(data[0]));
        } else {
            console.log('No students found. Trying to infer from error on invalid select...');
            const { error: err2 } = await supabase.from('students').select('classroom_id').limit(1);
            if (err2) {
                console.log('classroom_id check error:', err2.message);
            } else {
                console.log('classroom_id exists!');
            }
        }
    }
}

checkStudentSchema();
