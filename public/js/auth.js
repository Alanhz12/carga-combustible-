// Manejo de autenticación simplificado
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    
    // Verificar si hay una sesión activa al cargar la página
    checkSession();
    
    // Iniciar sesión
    loginBtn.addEventListener('click', function() {
        login();
    });
    
    // Cerrar sesión
    logoutBtn.addEventListener('click', function() {
        logout();
    });
});

// Verificar sesión activa
async function checkSession() {
    const user = localStorage.getItem('user');
    
    if (user) {
        updateUIForLoggedInUser(JSON.parse(user));
    } else {
        updateUIForLoggedOutUser();
    }
}

// Iniciar sesión simplificada
async function login() {
    const email = prompt('Por favor, ingrese su email:');
    if (!email) return;
    
    // En una app real, aquí verificarías credenciales con el backend
    const user = { email: email, name: email.split('@')[0] };
    localStorage.setItem('user', JSON.stringify(user));
    updateUIForLoggedInUser(user);
}

// Cerrar sesión
async function logout() {
    localStorage.removeItem('user');
    updateUIForLoggedOutUser();
}

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