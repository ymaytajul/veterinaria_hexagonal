/**
 * Config compartida para frontend.
 * Calcula rutas absolutas desde cualquier subcarpeta dentro de Frontend/.
 */
(function initConfig() {
    const path = window.location.pathname;
    const projectBase = path.includes('/Frontend/')
        ? path.split('/Frontend/')[0]
        : path.replace(/\/[^/]*$/, '');

    window.FRONTEND_BASE = `${projectBase}/Frontend`;
    window.API_BASE = `${projectBase}/index.php`;
    
    // Configuración global del sistema
    window.CONFIG = {
        // API
        API_URL: window.API_BASE,
        USE_MOCK_API: true,
        
        // Roles
        ROLES: {
            ADMIN: 'admin',
            CLIENTE: 'cliente'
        },
        
        // Estados de citas
        ESTADOS_CITA: {
            PROGRAMADA: 'programada',
            COMPLETADA: 'completada',
            CANCELADA: 'cancelada',
            PENDIENTE: 'pendiente'
        },
        
        // Métodos de pago
        METODOS_PAGO: ['Tarjeta', 'Efectivo', 'Yape', 'Plín'],
        
        // Servicios veterinarios
        SERVICIOS: [
            'Consulta General',
            'Vacunación',
            'Baño y Corte',
            'Cirugía Menor',
            'Limpieza Dental',
            'Desparasitación',
            'Rayos X',
            'Emergencia'
        ],
        
        // Especies
        ESPECIES: ['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro'],
        
        // Categorías inventario
        CATEGORIAS_INVENTARIO: ['Alimento', 'Accesorio', 'Higiene', 'Medicina', 'Juguete']
    };
    
    // Helpers de autenticación (globales)
    window.getAuthToken = function() {
        return localStorage.getItem('auth_token');
    };
    
    window.getUserRole = function() {
        return localStorage.getItem('user_role');
    };
    
    window.getUserId = function() {
        return localStorage.getItem('user_id');
    };
    
    window.getUserName = function() {
        return localStorage.getItem('user_name');
    };
    
    window.setAuthData = function(data) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('user_name', data.name);
    };
    
    window.clearAuthData = function() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
    };
    
    window.isAuthenticated = function() {
        return !!getAuthToken();
    };
    
    window.isAdmin = function() {
        return getUserRole() === CONFIG.ROLES.ADMIN;
    };
    
    // Mostrar mensajes toast
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    window.MOCK_MODE = true; 
})();