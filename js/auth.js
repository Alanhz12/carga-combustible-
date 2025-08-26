// Manejo de autenticación
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    
    // Verificar si hay una sesión activa al cargar la página
    checkSession();
    
    // Iniciar sesión
    loginBtn.addEventListener('click', function() {
        loginWithGoogle();
    });
    
    // Cerrar sesión
    logoutBtn.addEventListener('click', function() {
        logout();
    });
});

// Verificar sesión activa
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        updateUIForLoggedInUser(session.user);
    } else {
        updateUIForLoggedOutUser();
    }
}

// Iniciar sesión con Google
async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    
    if (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión: ' + error.message);
    }
}

// Cerrar sesión
async function logout() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Error al cerrar sesión:', error);
    } else {
        updateUIForLoggedOutUser();
    }
}

// Escuchar cambios en el estado de autenticación
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        updateUIForLoggedInUser(session.user);
    } else if (event === 'SIGNED_OUT') {
        updateUIForLoggedOutUser();
    }
});

// Actualizar UI para usuario autenticado
function updateUIForLoggedInUser(user) {
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('user-info').textContent = `Usuario: ${user.email}`;
    
    // Cargar datos una vez autenticado
    if (typeof loadInitialData === 'function') {
        loadInitialData();
    }
}

// Actualizar UI para usuario no autenticado
function updateUIForLoggedOutUser() {
    document.getElementById('login-btn').style.display = 'inline-block';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('user-info').textContent = '';
    
    // Limpiar la interfaz
    clearUI();
}

// Limpiar interfaz
function clearUI() {
    // Limpiar todas las tablas y datos mostrados
    if (document.getElementById('employees-count')) {
        document.getElementById('employees-count').textContent = '0';
    }
    if (document.getElementById('vehicles-count')) {
        document.getElementById('vehicles-count').textContent = '0';
    }
    if (document.getElementById('vouchers-count')) {
        document.getElementById('vouchers-count').textContent = '0';
    }
    if (document.getElementById('total-cost')) {
        document.getElementById('total-cost').textContent = '$0';
    }
    
    // Limpiar tablas
    if (document.getElementById('employees-table')) {
        document.getElementById('employees-table').innerHTML = '';
    }
    if (document.getElementById('vehicles-table')) {
        document.getElementById('vehicles-table').innerHTML = '';
    }
    if (document.getElementById('vouchers-table')) {
        document.getElementById('vouchers-table').innerHTML = '';
    }
    if (document.getElementById('price-history')) {
        document.getElementById('price-history').innerHTML = '';
    }
    
    // Limpiar selects
    if (document.getElementById('driver')) {
        document.getElementById('driver').innerHTML = '<option value="">Seleccionar chofer</option>';
    }
    if (document.getElementById('filter-driver')) {
        document.getElementById('filter-driver').innerHTML = '<option value="">Todos los choferes</option>';
    }
    if (document.getElementById('vehicle')) {
        document.getElementById('vehicle').innerHTML = '<option value="">Seleccionar vehículo</option>';
    }
    if (document.getElementById('filter-vehicle')) {
        document.getElementById('filter-vehicle').innerHTML = '<option value="">Todos los vehículos</option>';
    }
}