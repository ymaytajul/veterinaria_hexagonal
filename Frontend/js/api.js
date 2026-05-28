(function initApi() {
    
    // ========================================
    // MOCK DATA - Datos simulados (según Figma)
    // ========================================
    const MOCK_DATA = {
        // Login response
        login: {
            token: 'mock-token-123',
            role: 'admin',
            id: 1,
            name: 'Administrador'
        },
        
        // Dashboard stats
        'dashboard/stats': {
            totalPropietarios: 8,
            totalMascotas: 10,
            citasPendientes: 4,
            ingresosTotales: 2615
        },
        
        // Propietarios
        propietarios: [
            { id: 1, nombre: 'María García', email: 'maria@gmail.com', telefono: '+51 987 654 321', direccion: 'Av. Lima 234', registrado: '2024-01-15' },
            { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos@gmail.com', telefono: '+51 976 543 210', direccion: 'Jr. Puno 567', registrado: '2024-02-20' },
            { id: 3, nombre: 'Ana Torres', email: 'ana@gmail.com', telefono: '+51 965 432 109', direccion: 'Calle Los Olivos 89', registrado: '2024-03-10' }
        ],
        
        // Mascotas
        mascotas: [
            { id: 1, nombre: 'Luna', especie: 'Perro', raza: 'Golden Retriever', edad: '3 años', peso: '28 kg', propietario: 'María García' },
            { id: 2, nombre: 'Max', especie: 'Perro', raza: 'Labrador', edad: '5 años', peso: '32 kg', propietario: 'María García' },
            { id: 3, nombre: 'Michi', especie: 'Gato', raza: 'Siamés', edad: '2 años', peso: '4 kg', propietario: 'Carlos Rodríguez' }
        ],
        
        // Citas
        citas: [
            { id: 1, mascota: 'Luna', propietario: 'María García', servicio: 'Consulta General', fecha: '2026-05-10', hora: '09:00', veterinario: 'Dr. Ramírez', estado: 'completada', precio: 80 },
            { id: 2, mascota: 'Michi', propietario: 'Carlos Rodríguez', servicio: 'Vacunación', fecha: '2026-05-12', hora: '10:30', veterinario: 'Dra. López', estado: 'completada', precio: 60 },
            { id: 3, mascota: 'Rocky', propietario: 'Ana Torres', servicio: 'Baño y Corte', fecha: '2026-05-23', hora: '15:00', veterinario: 'Est. Martínez', estado: 'programada', precio: 70 }
        ],
        
        // Servicios
        servicios: [
            { id: 1, nombre: 'Consulta General', categoria: 'Consulta', duracion: '30 min', precio: 80, descripcion: 'Revisión general del estado de salud' },
            { id: 2, nombre: 'Vacunación', categoria: 'Vacuna', duracion: '20 min', precio: 60, descripcion: 'Aplicación de vacunas preventivas' },
            { id: 3, nombre: 'Baño y Corte', categoria: 'Estética', duracion: '90 min', precio: 70, descripcion: 'Baño, secado y corte de pelo' }
        ],
        
        // Inventario
        inventario: [
            { id: 1, nombre: 'Royal Canin Adult', categoria: 'Alimento', marca: 'Royal Canin', precio: 89, costo: 55, stock: 45, unidad: 'kg' },
            { id: 2, nombre: 'Whiskas Atún', categoria: 'Alimento', marca: 'Whiskas', precio: 35, costo: 20, stock: 80, unidad: 'paq' }
        ],
        
        // Ventas
        ventas: [
            { id: 1, fecha: '2026-05-10', cliente: 'María García', articulos: 2, total: 223, metodoPago: 'Tarjeta', estado: 'Completada' }
        ],
        
        // Historial
        historial: [
            { tipo: 'Venta', fecha: '2026-05-20', cliente: 'Roberto Silva', descripcion: '2x Shampoo medicado', monto: 138, detalle: 'Efectivo' }
        ]
    };
    
    // ========================================
    // API CLIENT con Mock Interceptor
    // ========================================
    class ApiClient {
        constructor() {
            this.baseUrl = window.API_BASE;
            this.mockMode = window.MOCK_MODE || true;
        }

        async request(endpoint, options = {}) {
            // 🔥 MODO MOCK: Devuelve datos simulados
            if (this.mockMode) {
                console.log(`[MOCK] ${options.method || 'GET'} ${endpoint}`);
                await this.delay(300); // Simula latencia de red
                return this.getMockResponse(endpoint, options);
            }
            
            // 🔥 MODO REAL: Llama al backend
            const url = `${this.baseUrl}${endpoint}`;
            const token = window.getAuthToken?.() || null;
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                    ...options.headers
                },
                ...options
            };

            try {
                const response = await fetch(url, config);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        }
        
        // Simula delay de red
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        // Retorna mock data según el endpoint
        getMockResponse(endpoint, options) {
            // Login
            if (endpoint === '/auth/login' && options.method === 'POST') {
                const body = options.body ? JSON.parse(options.body) : {};
                console.log('[MOCK][LOGIN] body:', body);
                if (body.email === 'admin@vet.com' && body.password === 'admin123') {
                    return MOCK_DATA.login;
                }
                throw new Error('Credenciales inválidas');
            }
            
            // Dashboard stats
            if (endpoint === '/dashboard/stats') {
                return MOCK_DATA['dashboard/stats'];
            }
            
            // Propietarios
            if (endpoint === '/propietarios') {
                if (options.method === 'GET') return MOCK_DATA.propietarios;
                if (options.method === 'POST') return { success: true, id: Date.now() };
            }
            
            // Mascotas
            if (endpoint === '/mascotas') {
                if (options.method === 'GET') return MOCK_DATA.mascotas;
                if (options.method === 'POST') return { success: true, id: Date.now() };
            }
            
            // Citas
            if (endpoint === '/citas') {
                if (options.method === 'GET') return MOCK_DATA.citas;
                if (options.method === 'POST') return { success: true, id: Date.now() };
            }
            
            // Confirmar cita
            if (endpoint.match(/\/citas\/\d+\/confirmar/)) {
                return { success: true, estado: 'confirmada' };
            }
            
            // Cancelar cita
            if (endpoint.match(/\/citas\/\d+\/cancelar/)) {
                return { success: true, estado: 'cancelada' };
            }
            
            // Servicios
            if (endpoint === '/servicios') {
                return MOCK_DATA.servicios;
            }
            
            // Inventario
            if (endpoint === '/inventario') {
                return MOCK_DATA.inventario;
            }
            
            // Ventas
            if (endpoint === '/ventas') {
                return MOCK_DATA.ventas;
            }
            
            // Historial
            if (endpoint === '/historial') {
                return MOCK_DATA.historial;
            }
            
            // Reportes
            if (endpoint === '/reportes') {
                return {
                    clienteMasLeal: { nombre: 'María García', citas: 4, gastado: 960 },
                    servicioMasAdquirido: { nombre: 'Vacunación', veces: 3 },
                    articuloMasVendido: { nombre: 'Royal Canin Adult', unidades: 7 }
                };
            }
            
            // Default: array vacío
            return [];
        }

        // ========================================
        // MÉTODOS PÚBLICOS (usados por auth.js y vistas)
        // ========================================
        login(email, password) {
            console.log('[API] login()', { email });
            return this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        }

        getDashboardStats() {
            return this.request('/dashboard/stats', { method: 'GET' });
        }

        getPropietarios() {
            return this.request('/propietarios', { method: 'GET' });
        }

        createPropietario(data) {
            return this.request('/propietarios', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }

        getMascotas() {
            return this.request('/mascotas', { method: 'GET' });
        }

        createMascota(data) {
            return this.request('/mascotas', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }

        getCitas() {
            return this.request('/citas', { method: 'GET' });
        }

        createCita(data) {
            return this.request('/citas', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }

        confirmarCita(id) {
            return this.request(`/citas/${id}/confirmar`, { method: 'PUT' });
        }

        cancelarCita(id) {
            return this.request(`/citas/${id}/cancelar`, { method: 'PUT' });
        }

        getServicios() {
            return this.request('/servicios', { method: 'GET' });
        }

        getInventario() {
            return this.request('/inventario', { method: 'GET' });
        }

        getVentas() {
            return this.request('/ventas', { method: 'GET' });
        }

        getHistorial() {
            return this.request('/historial', { method: 'GET' });
        }

        getReportes() {
            return this.request('/reportes', { method: 'GET' });
        }
    }

    window.api = new ApiClient();
})();