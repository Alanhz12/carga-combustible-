// Aplicación principal
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar la aplicación
    initApp();
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar fecha actual
    updateCurrentDate();
    
    // Cargar datos iniciales si el usuario está autenticado
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        loadInitialData();
    }
});

// Inicializar la aplicación
function initApp() {
    // Inicializar pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Inicializar sub pestañas
    const subtabs = document.querySelectorAll('.tab-submenu button');
    subtabs.forEach(subtab => {
        subtab.addEventListener('click', () => {
            const subtabName = subtab.getAttribute('data-subtab');
            const parentTab = subtab.closest('.tab-content').id.replace('-tab', '');
            switchSubTab(parentTab, subtabName);
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Generar vale
    document.getElementById('generateVoucher').addEventListener('click', generateVoucher);
    
    // Limpiar formulario
    document.getElementById('resetForm').addEventListener('click', resetForm);
    
    // Imprimir vale
    document.getElementById('printVoucher').addEventListener('click', printVoucher);
    
    // Guardar vale
    document.getElementById('saveVoucher').addEventListener('click', saveVoucher);
    
    // Empleados
    document.getElementById('addEmployee').addEventListener('click', addEmployeeHandler);
    
    // Vehículos
    document.getElementById('addVehicle').addEventListener('click', addVehicleHandler);
    
    // Precios
    document.getElementById('updatePrices').addEventListener('click', updatePricesHandler);
    
    // Filtros
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

// Actualizar fecha actual
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', options);
}

// Cambiar pestaña
function switchTab(tabName) {
    // Desactivar todas las pestañas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Ocultar todos los contenidos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar pestaña seleccionada
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Cargar datos si es necesario
    if (tabName === 'employees') {
        loadEmployeesTable();
    } else if (tabName === 'vehicles') {
        loadVehiclesTable();
    } else if (tabName === 'fuel-prices') {
        loadFuelPrices();
    } else if (tabName === 'records') {
        loadVouchersTable();
    }
}

// Cambiar sub pestaña
function switchSubTab(parentTab, subtabName) {
    const parentElement = document.getElementById(`${parentTab}-tab`);
    
    // Desactivar todos los botones de sub pestaña
    parentElement.querySelectorAll('.tab-submenu button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Ocultar todos los contenidos de sub pestaña
    parentElement.querySelectorAll('.subtab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar sub pestaña seleccionada
    parentElement.querySelector(`.tab-submenu button[data-subtab="${subtabName}"]`).classList.add('active');
    parentElement.getElementById(`${subtabName}`).classList.add('active');
}

// Cargar datos iniciales
async function loadInitialData() {
    try {
        // Cargar empleados y vehículos para los selects
        await loadDrivers();
        await loadVehicles();
        
        // Cargar estadísticas
        await loadStats();
        
        // Cargar precios actuales
        await loadCurrentPrices();
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
    }
}

// Cargar conductores en los selects
async function loadDrivers() {
    try {
        const employees = await getEmployees();
        
        // Select principal
        const driverSelect = document.getElementById('driver');
        driverSelect.innerHTML = '<option value="">Seleccionar chofer</option>';
        
        // Select de filtro
        const filterDriverSelect = document.getElementById('filter-driver');
        filterDriverSelect.innerHTML = '<option value="">Todos los choferes</option>';
        
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.name;
            
            driverSelect.appendChild(option.cloneNode(true));
            filterDriverSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar conductores:', error);
    }
}

// Cargar vehículos en los selects
async function loadVehicles() {
    try {
        const vehicles = await getVehicles();
        
        // Select principal
        const vehicleSelect = document.getElementById('vehicle');
        vehicleSelect.innerHTML = '<option value="">Seleccionar vehículo</option>';
        
        // Select de filtro
        const filterVehicleSelect = document.getElementById('filter-vehicle');
        filterVehicleSelect.innerHTML = '<option value="">Todos los vehículos</option>';
        
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = `${vehicle.brand} ${vehicle.model} (${vehicle.patent})`;
            
            vehicleSelect.appendChild(option.cloneNode(true));
            filterVehicleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar vehículos:', error);
    }
}

// Cargar estadísticas
async function loadStats() {
    try {
        const employees = await getEmployees();
        const vehicles = await getVehicles();
        const vouchers = await getVouchers();
        
        // Calcular total gastado
        let totalCost = 0;
        vouchers.forEach(voucher => {
            totalCost += voucher.amount * voucher.price_per_liter;
        });
        
        // Actualizar UI
        document.getElementById('employees-count').textContent = employees.length;
        document.getElementById('vehicles-count').textContent = vehicles.length;
        document.getElementById('vouchers-count').textContent = vouchers.length;
        document.getElementById('total-cost').textContent = `$${totalCost.toLocaleString('es-ES')}`;
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// Cargar precios actuales
async function loadCurrentPrices() {
    try {
        const prices = await getFuelPrices();
        
        if (prices) {
            document.getElementById('diesel-price').value = prices.diesel || 0;
            document.getElementById('premium-price').value = prices.diesel_premium || 0;
            document.getElementById('nafta-super-price').value = prices.nafta_super || 0;
            document.getElementById('nafta-premium-price').value = prices.nafta_premium || 0;
            document.getElementById('gas-price').value = prices.gnc || 0;
        }
    } catch (error) {
        console.error('Error al cargar precios actuales:', error);
    }
}

// Generar vista previa del vale
function generateVoucher() {
    // Validar formulario
    const driverSelect = document.getElementById('driver');
    const vehicleSelect = document.getElementById('vehicle');
    const amountInput = document.getElementById('amount');
    const priceInput = document.getElementById('price');
    
    if (!driverSelect.value) {
        alert('Por favor, seleccione un chofer');
        return;
    }
    
    if (!vehicleSelect.value) {
        alert('Por favor, seleccione un vehículo');
        return;
    }
    
    if (!amountInput.value || amountInput.value <= 0) {
        alert('Por favor, ingrese una cantidad válida de litros');
        return;
    }
    
    if (!priceInput.value || priceInput.value <= 0) {
        alert('Por favor, ingrese un precio válido por litro');
        return;
    }
    
    // Obtener valores del formulario
    const driverName = driverSelect.options[driverSelect.selectedIndex].text;
    const vehicleText = vehicleSelect.options[vehicleSelect.selectedIndex].text;
    const fuelType = document.getElementById('fuelType').value;
    const amount = amountInput.value;
    const station = document.getElementById('station').value;
    const observations = document.getElementById('observations').value;
    const price = priceInput.value;
    
    // Generar número de vale (formato: VC-YYYY-NNNNN)
    const now = new Date();
    const voucherNumber = `VC-${now.getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Formatear fecha
    const formattedDate = now.toLocaleDateString('es-ES');
    
    // Actualizar vista previa
    document.getElementById('voucherNumber').textContent = voucherNumber;
    document.getElementById('voucherDate').textContent = formattedDate;
    document.getElementById('voucherDriver').textContent = driverName;
    document.getElementById('voucherVehicle').textContent = vehicleText;
    document.getElementById('voucherFuel').textContent = getFuelTypeName(fuelType);
    document.getElementById('voucherAmount').textContent = `${amount} L`;
    document.getElementById('voucherStation').textContent = getStationName(station);
    document.getElementById('voucherObservations').textContent = observations || '-';
    
    // Agregar firma si existe
    const signatureImg = document.getElementById('voucherSignature');
    const signatureData = getSignatureImage();
    
    if (signatureData && !signatureData.includes('data:,')) {
        signatureImg.src = signatureData;
        signatureImg.style.display = 'block';
    } else {
        signatureImg.style.display = 'none';
    }
    
    // Mostrar vista previa
    document.getElementById('voucherPreview').style.display = 'block';
    
    // Guardar datos para posterior guardado
    window.currentVoucherData = {
        voucher_number: voucherNumber,
        driver_id: driverSelect.value,
        vehicle_id: vehicleSelect.value,
        fuel_type: fuelType,
        amount: parseFloat(amount),
        station: station,
        observations: observations,
        price_per_liter: parseFloat(price),
        date: now.toISOString().split('T')[0],
        signature: signatureData
    };
}

// Obtener nombre del tipo de combustible
function getFuelTypeName(type) {
    const types = {
        'diesel': 'Diésel',
        'premium': 'Diésel Premium',
        'Nafta': 'Nafta Super',
        'Nafta Premium': 'Nafta Premium',
        'gas': 'GNC'
    };
    
    return types[type] || type;
}

// Obtener nombre de la estación de servicio
function getStationName(station) {
    const stations = {
        'ypf': 'YPF',
        'shell': 'Shell',
        'axion': 'Axion',
        'Puma': 'Puma',
        'otros': 'Otra'
    };
    
    return stations[station] || station;
}

// Limpiar formulario
function resetForm() {
    document.getElementById('driver').value = '';
    document.getElementById('vehicle').value = '';
    document.getElementById('fuelType').value = 'diesel';
    document.getElementById('amount').value = '';
    document.getElementById('station').value = 'ypf';
    document.getElementById('observations').value = '';
    document.getElementById('price').value = '';
    
    clearSignature();
    
    document.getElementById('voucherPreview').style.display = 'none';
    
    delete window.currentVoucherData;
}

// Imprimir vale
function printVoucher() {
    window.print();
}

// Guardar vale en la base de datos
async function saveVoucher() {
    if (!window.currentVoucherData) {
        alert('No hay datos de vale para guardar. Por favor, genere el vale primero.');
        return;
    }
    
    try {
        await addVoucher(window.currentVoucherData);
        alert('Vale guardado correctamente en el sistema.');
        
        // Actualizar estadísticas
        await loadStats();
        
        // Limpiar formulario
        resetForm();
    } catch (error) {
        console.error('Error al guardar el vale:', error);
        alert('Error al guardar el vale: ' + error.message);
    }
}

// Agregar empleado
async function addEmployeeHandler() {
    const name = document.getElementById('employee-name').value;
    const dni = document.getElementById('employee-dni').value;
    const license = document.getElementById('employee-license').value;
    const phone = document.getElementById('employee-phone').value;
    
    if (!name || !dni) {
        alert('Por favor, complete al menos el nombre y DNI del empleado.');
        return;
    }
    
    try {
        await addEmployee({
            name: name,
            dni: dni,
            license: license,
            phone: phone
        });
        
        alert('Empleado agregado correctamente.');
        
        // Limpiar formulario
        document.getElementById('employee-name').value = '';
        document.getElementById('employee-dni').value = '';
        document.getElementById('employee-license').value = '';
        document.getElementById('employee-phone').value = '';
        
        // Actualizar lista de empleados
        await loadDrivers();
        await loadStats();
    } catch (error) {
        console.error('Error al agregar empleado:', error);
        alert('Error al agregar empleado: ' + error.message);
    }
}

// Cargar tabla de empleados
async function loadEmployeesTable() {
    try {
        const employees = await getEmployees();
        const table = document.getElementById('employees-table');
        table.innerHTML = '';
        
        employees.forEach(employee => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.dni}</td>
                <td>${employee.license || '-'}</td>
                <td>${employee.phone || '-'}</td>
                <td>
                    <button class="btn btn-secondary edit-employee" data-id="${employee.id}">Editar</button>
                    <button class="btn btn-secondary delete-employee" data-id="${employee.id}">Eliminar</button>
                </td>
            `;
            
            table.appendChild(row);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.edit-employee').forEach(button => {
            button.addEventListener('click', () => editEmployee(button.getAttribute('data-id')));
        });
        
        document.querySelectorAll('.delete-employee').forEach(button => {
            button.addEventListener('click', () => deleteEmployeeHandler(button.getAttribute('data-id')));
        });
    } catch (error) {
        console.error('Error al cargar tabla de empleados:', error);
    }
}

// Editar empleado (placeholder)
function editEmployee(id) {
    alert('Funcionalidad de edición en desarrollo. ID: ' + id);
}

// Eliminar empleado
async function deleteEmployeeHandler(id) {
    if (!confirm('¿Está seguro de que desea eliminar este empleado?')) {
        return;
    }
    
    try {
        await deleteEmployee(id);
        alert('Empleado eliminado correctamente.');
        
        // Actualizar tabla
        await loadEmployeesTable();
        await loadDrivers();
        await loadStats();
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        alert('Error al eliminar empleado: ' + error.message);
    }
}

// Agregar vehículo
async function addVehicleHandler() {
    const patent = document.getElementById('vehicle-patent').value;
    const brand = document.getElementById('vehicle-brand').value;
    const model = document.getElementById('vehicle-model').value;
    const year = document.getElementById('vehicle-year').value;
    const type = document.getElementById('vehicle-type').value;
    
    if (!patent || !brand) {
        alert('Por favor, complete al menos la patente y marca del vehículo.');
        return;
    }
    
    try {
        await addVehicle({
            patent: patent,
            brand: brand,
            model: model,
            year: year ? parseInt(year) : null,
            type: type
        });
        
        alert('Vehículo agregado correctamente.');
        
        // Limpiar formulario
        document.getElementById('vehicle-patent').value = '';
        document.getElementById('vehicle-brand').value = '';
        document.getElementById('vehicle-model').value = '';
        document.getElementById('vehicle-year').value = '';
        document.getElementById('vehicle-type').value = 'camion';
        
        // Actualizar lista de vehículos
        await loadVehicles();
        await loadStats();
    } catch (error) {
        console.error('Error al agregar vehículo:', error);
        alert('Error al agregar vehículo: ' + error.message);
    }
}

// Cargar tabla de vehículos
async function loadVehiclesTable() {
    try {
        const vehicles = await getVehicles();
        const table = document.getElementById('vehicles-table');
        table.innerHTML = '';
        
        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${vehicle.patent}</td>
                <td>${vehicle.brand}</td>
                <td>${vehicle.model || '-'}</td>
                <td>${vehicle.year || '-'}</td>
                <td>${getVehicleTypeName(vehicle.type)}</td>
                <td>
                    <button class="btn btn-secondary edit-vehicle" data-id="${vehicle.id}">Editar</button>
                    <button class="btn btn-secondary delete-vehicle" data-id="${vehicle.id}">Eliminar</button>
                </td>
            `;
            
            table.appendChild(row);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.edit-vehicle').forEach(button => {
            button.addEventListener('click', () => editVehicle(button.getAttribute('data-id')));
        });
        
        document.querySelectorAll('.delete-vehicle').forEach(button => {
            button.addEventListener('click', () => deleteVehicleHandler(button.getAttribute('data-id')));
        });
    } catch (error) {
        console.error('Error al cargar tabla de vehículos:', error);
    }
}

// Obtener nombre del tipo de vehículo
function getVehicleTypeName(type) {
    const types = {
        'camion': 'Camión',
        'camioneta': 'Camioneta',
        'auto': 'Automóvil',
        'maquinaria': 'Maquinaria'
    };
    
    return types[type] || type;
}

// Editar vehículo (placeholder)
function editVehicle(id) {
    alert('Funcionalidad de edición en desarrollo. ID: ' + id);
}

// Eliminar vehículo
async function deleteVehicleHandler(id) {
    if (!confirm('¿Está seguro de que desea eliminar este vehículo?')) {
        return;
    }
    
    try {
        await deleteVehicle(id);
        alert('Vehículo eliminado correctamente.');
        
        // Actualizar tabla
        await loadVehiclesTable();
        await loadVehicles();
        await loadStats();
    } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        alert('Error al eliminar vehículo: ' + error.message);
    }
}

// Actualizar precios
async function updatePricesHandler() {
    const diesel = document.getElementById('diesel-price').value;
    const premium = document.getElementById('premium-price').value;
    const naftaSuper = document.getElementById('nafta-super-price').value;
    const naftaPremium = document.getElementById('nafta-premium-price').value;
    const gas = document.getElementById('gas-price').value;
    
    if (!diesel || !premium || !naftaSuper || !naftaPremium || !gas) {
        alert('Por favor, complete todos los precios.');
        return;
    }
    
    try {
        await addFuelPrices({
            diesel: parseFloat(diesel),
            diesel_premium: parseFloat(premium),
            nafta_super: parseFloat(naftaSuper),
            nafta_premium: parseFloat(naftaPremium),
            gnc: parseFloat(gas)
        });
        
        alert('Precios actualizados correctamente.');
        
        // Actualizar historial
        await loadFuelPriceHistory();
    } catch (error) {
        console.error('Error al actualizar precios:', error);
        alert('Error al actualizar precios: ' + error.message);
    }
}

// Cargar precios de combustible
async function loadFuelPrices() {
    await loadCurrentPrices();
    await loadFuelPriceHistory();
}

// Cargar historial de precios
async function loadFuelPriceHistory() {
    try {
        const pricesHistory = await getFuelPriceHistory();
        const table = document.getElementById('price-history');
        table.innerHTML = '';
        
        pricesHistory.forEach(price => {
            const row = document.createElement('tr');
            const date = new Date(price.created_at).toLocaleDateString('es-ES');
            
            row.innerHTML = `
                <td>${date}</td>
                <td>$${price.diesel?.toLocaleString('es-ES') || '-'}</td>
                <td>$${price.diesel_premium?.toLocaleString('es-ES') || '-'}</td>
                <td>$${price.nafta_super?.toLocaleString('es-ES') || '-'}</td>
                <td>$${price.nafta_premium?.toLocaleString('es-ES') || '-'}</td>
                <td>$${price.gnc?.toLocaleString('es-ES') || '-'}</td>
            `;
            
            table.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar historial de precios:', error);
    }
}

// Aplicar filtros
async function applyFilters() {
    const dateFrom = document.getElementById('filter-date-from').value;
    const dateTo = document.getElementById('filter-date-to').value;
    const driver = document.getElementById('filter-driver').value;
    const vehicle = document.getElementById('filter-vehicle').value;
    
    await loadVouchersTable({
        dateFrom: dateFrom,
        dateTo: dateTo,
        driver: driver,
        vehicle: vehicle
    });
}

// Restablecer filtros
async function resetFilters() {
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';
    document.getElementById('filter-driver').value = '';
    document.getElementById('filter-vehicle').value = '';
    
    await loadVouchersTable();
}

// Cargar tabla de vales
async function loadVouchersTable(filters = {}) {
    try {
        const vouchers = await getVouchers(filters);
        const table = document.getElementById('vouchers-table');
        table.innerHTML = '';
        
        vouchers.forEach(voucher => {
            const row = document.createElement('tr');
            const date = new Date(voucher.date).toLocaleDateString('es-ES');
            const total = voucher.amount * voucher.price_per_liter;
            
            row.innerHTML = `
                <td>${date}</td>
                <td>${voucher.voucher_number}</td>
                <td>${voucher.employees?.name || 'N/A'}</td>
                <td>${voucher.vehicles ? `${voucher.vehicles.brand} ${voucher.vehicles.model} (${voucher.vehicles.patent})` : 'N/A'}</td>
                <td>${getFuelTypeName(voucher.fuel_type)}</td>
                <td>${voucher.amount} L</td>
                <td>$${voucher.price_per_liter.toLocaleString('es-ES')}</td>
                <td>$${total.toLocaleString('es-ES')}</td>
                <td>${getStationName(voucher.station)}</td>
                <td>
                    <button class="btn btn-secondary view-voucher" data-id="${voucher.id}">Ver</button>
                    <button class="btn btn-secondary delete-voucher" data-id="${voucher.id}">Eliminar</button>
                </td>
            `;
            
            table.appendChild(row);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.view-voucher').forEach(button => {
            button.addEventListener('click', () => viewVoucher(button.getAttribute('data-id')));
        });
        
        document.querySelectorAll('.delete-voucher').forEach(button => {
            button.addEventListener('click', () => deleteVoucherHandler(button.getAttribute('data-id')));
        });
    } catch (error) {
        console.error('Error al cargar tabla de vales:', error);
    }
}

// Ver vale (placeholder)
function viewVoucher(id) {
    alert('Funcionalidad de visualización en desarrollo. ID: ' + id);
}

// Eliminar vale
async function deleteVoucherHandler(id) {
    if (!confirm('¿Está seguro de que desea eliminar este vale?')) {
        return;
    }
    
    try {
        await deleteVoucher(id);
        alert('Vale eliminado correctamente.');
        
        // Actualizar tabla
        await loadVouchersTable();
        await loadStats();
    } catch (error) {
        console.error('Error al eliminar vale:', error);
        alert('Error al eliminar vale: ' + error.message);
    }
}