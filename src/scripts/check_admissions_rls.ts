import { supabase } from '@/lib/supabaseClient';

async function checkAdmissionsRLS() {
    const { data, error } = await supabase.from('admissions').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Admissions Anon Select Error:", error);
    } else {
        console.log("Admissions Anon Select Success. Count:", data);
    }
}

checkAdmissionsRLS();
