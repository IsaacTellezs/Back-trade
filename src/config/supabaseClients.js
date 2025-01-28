import { createClient } from "@supabase/supabase-js";  


const supabaseUrl = "https://pqyyjobayfpygizlqnzz.supabase.co"; // Reemplaza con la URL de tu proyecto
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeXlqb2JheWZweWdpemxxbnp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODA4MzAzMiwiZXhwIjoyMDUzNjU5MDMyfQ.z8Xlw_g6k6o2EM6OKLqD9Ccu-Xe2wrGwpRtwhTkFYac"; // Utiliza la clave de servicio encontrada en Settings > API

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
