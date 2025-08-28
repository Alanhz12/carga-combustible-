// Configuración para PostgreSQL en Railway
const { Pool } = require('pg'); // Este archivo se usará en el backend

// Para el frontend, necesitaremos crear una API
const API_BASE_URL = 'https://tu-app.railway.app'; // Cambiar por tu URL de Railway

// Función para hacer requests a la API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Hacer disponible globalmente para reemplazar Supabase
window.apiRequest = apiRequest;