// Funciones para interactuar con Supabase

// Empleados
async function getEmployees() {
    try {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .order('name');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        return [];
    }
}

async function addEmployee(employee) {
    try {
        const { data, error } = await supabase
            .from('employees')
            .insert([employee])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al agregar empleado:', error);
        throw error;
    }
}

async function updateEmployee(id, employee) {
    try {
        const { error } = await supabase
            .from('employees')
            .update(employee)
            .eq('id', id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        throw error;
    }
}

async function deleteEmployee(id) {
    try {
        const { error } = await supabase
            .from('employees')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        throw error;
    }
}

// Vehículos
async function getVehicles() {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('brand');
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener vehículos:', error);
        return [];
    }
}

async function addVehicle(vehicle) {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .insert([vehicle])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al agregar vehículo:', error);
        throw error;
    }
}

async function updateVehicle(id, vehicle) {
    try {
        const { error } = await supabase
            .from('vehicles')
            .update(vehicle)
            .eq('id', id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        throw error;
    }
}

async function deleteVehicle(id) {
    try {
        const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        throw error;
    }
}

// Vales
async function getVouchers(filters = {}) {
    try {
        let query = supabase
            .from('vouchers')
            .select(`
                *,
                employees (name),
                vehicles (patent, brand, model)
            `);
        
        // Aplicar filtros
        if (filters.dateFrom && filters.dateTo) {
            query = query.gte('date', filters.dateFrom).lte('date', filters.dateTo);
        }
        
        if (filters.driver) {
            query = query.eq('driver_id', filters.driver);
        }
        
        if (filters.vehicle) {
            query = query.eq('vehicle_id', filters.vehicle);
        }
        
        const { data, error } = await query.order('date', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener vales:', error);
        return [];
    }
}

async function addVoucher(voucher) {
    try {
        const { data, error } = await supabase
            .from('vouchers')
            .insert([voucher])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al agregar vale:', error);
        throw error;
    }
}

async function updateVoucher(id, voucher) {
    try {
        const { error } = await supabase
            .from('vouchers')
            .update(voucher)
            .eq('id', id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error al actualizar vale:', error);
        throw error;
    }
}

async function deleteVoucher(id) {
    try {
        const { error } = await supabase
            .from('vouchers')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error al eliminar vale:', error);
        throw error;
    }
}

// Precios de combustible
async function getFuelPrices() {
    try {
        const { data, error } = await supabase
            .from('fuel_prices')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) throw error;
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('Error al obtener precios:', error);
        return null;
    }
}

async function addFuelPrices(prices) {
    try {
        const { data, error } = await supabase
            .from('fuel_prices')
            .insert([prices])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al agregar precios:', error);
        throw error;
    }
}

async function getFuelPriceHistory() {
    try {
        const { data, error } = await supabase
            .from('fuel_prices')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener historial de precios:', error);
        return [];
    }
}