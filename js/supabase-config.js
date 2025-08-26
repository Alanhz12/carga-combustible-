// Configuración de Supabase
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; // Reemplazar con tu URL
const SUPABASE_ANON_KEY = 'tu-anon-key'; // Reemplazar con tu clave anónima

// Inicializar Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);