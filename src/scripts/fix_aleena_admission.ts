import { supabase } from '@/lib/supabaseClient';

async function fixAleena() {
    const admissionId = '08936ac5-5e9f-4542-9a75-87936f645067';

    // 1. Fetch Admission
    const { data: admission, error: fetchError } = await supabase
        .from('admissions')
        .select('*')
        .eq('id', admissionId)
        .single();

    if (fetchError || !admission) {
        console.error("Admission not found:", fetchError);
        return;
    }

    console.log("Found Admission:", admission.applicant_name);

    // 2. Update Status to Approved
    const { error: updateError } = await supabase
        .from('admissions')
        .update({ status: 'approved' })
        .eq('id', admissionId);

    if (updateError) {
        console.error("Failed to update status:", updateError);
        return;
    }
    console.log("Status updated to approved.");

    // 3. Create Student
    // Mapping logic
    const programToGradeMap: Record<string, string> = {
        "Pre-school p1": "Pre-School 1",
        "Pre-school p2": "Pre-School 2",
        "Kindergarten K1": "Kindergarten 1",
        "Kindergarten K2": "Kindergarten 2"
    };
    const grade = programToGradeMap[admission.program_selection] || admission.program_selection;

    // Generate NIS
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const nis = `REG-${dateStr}-${randomSuffix}`;

    const { error: insertError } = await supabase
        .from('students')
        .insert([{
            name: admission.applicant_name,
            nis: nis,
            grade: grade,
            place_of_birth: admission.place_of_birth,
            date_of_birth: admission.date_of_birth,
            gender: admission.gender,
            // religion: admission.religion, 
            parent_name: admission.parent_name,
            parent_email: admission.parent_email,
            parent_phone: admission.parent_phone,
            email: admission.email,
            phone: admission.phone,
            status: 'active',
            enrollment_year: new Date().getFullYear().toString(),
            updated_at: new Date().toISOString()
        }]); // created_at defaults to now

    if (insertError) {
        console.error("Student insert failed:", insertError);
    } else {
        console.log(`Student created successfully: ${admission.applicant_name} as ${grade} (${nis})`);
    }
}

fixAleena();
