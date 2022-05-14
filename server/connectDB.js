require('dotenv').config()
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const { createClient } =  require('@supabase/supabase-js');


const connectDB = () => {
    const supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
}

module.exports = {
    connectDB
}