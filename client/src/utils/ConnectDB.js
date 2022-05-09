const {SUPABASE_URL, SUPABASE_KEY} = require('../keys.js');

const { createClient } =  require('@supabase/supabase-js');

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);