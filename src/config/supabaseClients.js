import { createClient } from "@supabase/supabase-js";  
import { SUPABASE_KEY, SUPABASE_URL } from "./config.js";


const supabaseUrl = SUPABASE_URL; 
const supabaseKey = SUPABASE_KEY; 

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
