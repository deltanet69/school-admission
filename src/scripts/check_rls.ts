import { supabase } from '@/lib/supabaseClient';

async function checkRLS() {
    // Try to select from students as anon (using the default client)
    const { data, error } = await supabase.from('students').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Anon Select Error:", error);
    } else {
        console.log("Anon Select Success. Count:", data); // valid response means readable by anon
    }

    // Try to insert as anon
    const { error: insertError } = await supabase.from('students').insert([{ name: "Anon Test", status: "active", nis: "ANON" }]);
    if (insertError) {
        console.error("Anon Insert Error:", insertError);
    } else {
        console.log("Anon Insert Success");
    }
}

checkRLS();
