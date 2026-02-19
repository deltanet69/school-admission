import { supabase } from '@/lib/supabaseClient';

async function findAdmission() {
    const { data, error } = await supabase
        .from('admissions')
        .select('*')
        .ilike('applicant_name', '%Aleena%')
        .single();

    if (error) {
        console.error("Error finding admission:", error);
    } else {
        console.log("Found Admission:", JSON.stringify(data, null, 2));

        // Check if student exists
        const { data: student } = await supabase.from('students').select('*').eq('name', data.applicant_name);
        console.log("Existing Student Check:", student);
    }
}

findAdmission();
