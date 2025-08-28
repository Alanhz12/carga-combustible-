// Funciones para interactuar con la API en lugar de Supabase

// Empleados
async function getEmployees() {
    try {
        const data = await apiRequest('/api/employees');
        return data;
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        return [];
    }
}

async function addEmployee(employee) {
    try {
        const data = await apiRequest('/api/employees', {
            method: 'POST',
            body: JSON.stringify(employee)
        });
        return data;
    } catch (error) {
        console.error('Error al agregar empleado:', error);
        throw error;
    }
}

async function deleteEmployee(id) {
    try {
        await apiRequest(`/api/employees/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        throw error;
    }
}

// Vehículos
async function getVehicles() {
    try {
        const data = await apiRequest('/api/vehicles');
        return data;
    } catch (error) {
        console.error('Error al obtener vehículos:', error);
        return [];
    }
}

async function addVehicle(vehicle) {
    try {
        const data = await apiRequest('/api/vehicles', {
            method: 'POST',
            body: JSON.stringify(vehicle)
        });
        return data;
    } catch (error) {
        console.error('Error al agregar vehículo:', error);
        throw error;
    }
}

async function deleteVehicle(id) {
    try {
        await apiRequest(`/api/vehicles/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        throw error;
    }
}

// Vales
async function getVouchers(filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
        if (filters.driver) queryParams.append('driver', filters.driver);
        if (filters.vehicle) queryParams.append('vehicle', filters.vehicle);
        
        const data = await apiRequest(`/api/vouchers?${queryParams}`);
        return data;
    } catch (error) {
        console.error('Error al obtener vales:', error);
        return [];
    }
}

async function addVoucher(voucher) {
    try {
        const data = await apiRequest('/api/vouchers', {
            method: 'POST',
            body: JSON.stringify(voucher)
        });
        return data;
    } catch (error) {
        console.error('Error al agregar vale:', error);
        throw error;
    }
}

async function deleteVoucher(id) {
    try {
        await apiRequest(`/api/vouchers/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error al eliminar vale:', error);
        throw error;
    }
}

// Precios de combustible
async function getFuelPrices() {
    try {
        const data = await apiRequest('/api/fuel-prices/latest');
        return data;
    } catch (error) {
        console.error('Error al obtener precios:', error);
        return null;
    }
}

async function addFuelPrices(prices) {
    try {
        const data = await apiRequest('/api/fuel-prices', {
            method: 'POST',
            body: JSON.stringify(prices)
        });
        return data;
    } catch (error) {
        console.error('Error al agregar precios:', error);
        throw error;
    }
}

async function getFuelPriceHistory() {
    try {
        const data = await apiRequest('/api/fuel-prices/history');
        return data;
    } catch (error) {
        console.error('Error al obtener historial de precios:', error);
        return [];
    }
}