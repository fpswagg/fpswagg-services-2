import { createClient } from '@supabase/supabase-js';

import { supabaseUrl, supabaseKey } from 'src/utils/variables';

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Key is missing or invalid');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
