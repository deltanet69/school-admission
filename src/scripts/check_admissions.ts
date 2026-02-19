import { supabase } from '@/lib/supabaseClient';

async function checkAdmissions() {
    const { data, error } = await supabase
        .from('admissions')
        .select('id, applicant_name, payment_status, order_id, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching admissions:', error);
    } else {
        console.log('Recent Admissions:', JSON.stringify(data, null, 2));
    }
}

checkAdmissions();
