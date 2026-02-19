import { supabase } from '@/lib/supabaseClient';

async function checkClassrooms() {
    const { data, error } = await supabase
        .from('classrooms')
        .select('id, name, capacity');

    if (error) {
        console.error('Error fetching classrooms:', error);
    } else {
        console.log('Classrooms:', JSON.stringify(data, null, 2));
    }
}

checkClassrooms();
