// Configuración de Supabase
const SUPABASE_URL = 'https://lrtczirexndojapueusk.supabase.co'; // Reemplazar con tu URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydGN6aXJleG5kb2phcHVldXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMDc5ODUsImV4cCI6MjA3MTc4Mzk4NX0.K04WA7oHpJvCPBHsOBpBnoEBb68YiXl6zrUy56I7cYc'; // Reemplazar con tu clave anónima

// Inicializar Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase inicializado correctamente');