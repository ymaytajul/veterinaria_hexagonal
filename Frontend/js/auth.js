/**
 * Sistema de Autenticacion - MODO HIBRIDO
 * 
 * - Admin: Conexion REAL a la base de datos (backend)
 * - Cliente: MODO MOCK (simulado) hasta que el backend este listo
 */

(function initAuth() {
    // ========================================
    // CONFIGURACION
    // ========================================
    const MOCK_MODE_FOR_CLIENT = true;  // Cliente usa mock, Admin usa backend real
    
    // Credenciales MOCK solo para cliente (admin va a la BD real)
    const MOCK_CLIENT = {
        'cliente@vet.com': { 
            password: 'cliente123', 
            rol: 'cliente', 
            id: 2, 
            nombre: 'Cliente Demo',
            token: 'mock-token-cliente-456'
        }
    };
    
    // Obtener URL base
    const path = window.location.pathname;
    const projectBase = path.includes('/Frontend/')
        ? path.split('/Frontend/')[0]
        : path.replace(/\/[^/]*$/, '');
    
    window.FRONTEND_BASE = `${projectBase}/Frontend`;
    window.API_BASE = `${projectBase}/index.php`;
    
    // ========================================
    // CLASE PRINCIPAL DE AUTENTICACION
    // ========================================
    class AuthManager {
        constructor() {
            this.init();
        }
        
        init() {
            const currentPath = window.location.pathname;
            const userRole = this.getUserRole();
            
            if (currentPath.includes('/admin/') && userRole !== 'admin') {
                this.redirectToLogin();
                return;
            }
            
            if (currentPath.includes('/cliente/') && userRole !== 'cliente') {
                this.redirectToLogin();
                return;
            }
            
            this.updateUserUI();
        }
        
        /**
         * LOGIN - HIBRIDO: 
         * - Si es admin: llama al backend real
         * - Si es cliente: usa mock (por ahora)
         */
        async login(email, password) {
            try {
                this.showLoading(true);
                
                // ========================================
                // DETECTAR SI ES CLIENTE (usar MOCK)
                // ========================================
                const isClientMock = MOCK_MODE_FOR_CLIENT && MOCK_CLIENT[email];
                
                if (isClientMock) {
                    console.log('[MOCK] Login de CLIENTE - Simulado');
                    await this.delay(500);
                    
                    const user = MOCK_CLIENT[email];
                    
                    if (user && user.password === password) {
                        localStorage.setItem('auth_token', user.token);
                        localStorage.setItem('user_role', user.rol);
                        localStorage.setItem('user_id', user.id);
                        localStorage.setItem('user_name', user.nombre);
                        
                        this.showToast(`✅ Bienvenido, ${user.nombre}!`, 'success');
                        
                        setTimeout(() => {
                            window.location.href = `${window.FRONTEND_BASE}/cliente/dashboard.html`;
                        }, 500);
                        return true;
                    } else {
                        this.showToast('❌ Credenciales de cliente incorrectas', 'error');
                        return false;
                    }
                }
                
                // ========================================
                // ADMIN: Conexion REAL al backend
                // ========================================
                console.log('[REAL] Login de ADMIN - Conectando a BD');
                
                const response = await fetch(`${window.API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok || !data.success) {
                    const errorMsg = data.error || 'Credenciales incorrectas';
                    this.showToast(errorMsg, 'error');
                    return false;
                }
                
                if (data.token) {
                    localStorage.setItem('auth_token', data.token);
                }
                localStorage.setItem('user_role', data.rol);
                localStorage.setItem('user_id', data.id);
                localStorage.setItem('user_name', data.nombre || 'Administrador');
                
                this.showToast(`✅ Bienvenido, ${data.nombre || 'Administrador'}!`, 'success');
                
                setTimeout(() => {
                    window.location.href = `${window.FRONTEND_BASE}/admin/dashboard.html`;
                }, 500);
                
                return true;
                
            } catch (error) {
                console.error('Error en login:', error);
                this.showToast('Error de conexion con el servidor', 'error');
                return false;
            } finally {
                this.showLoading(false);
            }
        }
        
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        logout() {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_name');
            
            this.showToast('Sesion cerrada correctamente', 'info');
            
            setTimeout(() => {
                window.location.href = `${window.FRONTEND_BASE}/index.html`;
            }, 300);
        }
        
        getUserRole() {
            return localStorage.getItem('user_role');
        }
        
        isAuthenticated() {
            return !!localStorage.getItem('auth_token');
        }
        
        isAdmin() {
            return this.getUserRole() === 'admin';
        }
        
        isCliente() {
            return this.getUserRole() === 'cliente';
        }
        
        getToken() {
            return localStorage.getItem('auth_token');
        }
        
        redirectToLogin() {
            window.location.href = `${window.FRONTEND_BASE}/login.html`;
        }
        
        redirectToLanding() {
            window.location.href = `${window.FRONTEND_BASE}/index.html`;
        }
        
        updateUserUI() {
            const userNameEl = document.getElementById('userName');
            const userRoleEl = document.getElementById('userRole');
            const userAvatarEl = document.getElementById('userAvatar');
            
            const userName = localStorage.getItem('user_name') || 'Usuario';
            const userRole = this.getUserRole();
            
            if (userNameEl) userNameEl.innerHTML = `<strong>${userName}</strong>`;
            if (userRoleEl) userRoleEl.textContent = userRole === 'admin' ? 'Administrador' : 'Cliente';
            if (userAvatarEl) userAvatarEl.textContent = userName.charAt(0).toUpperCase();
        }
        
        showToast(message, type = 'success') {
            const existingToast = document.querySelector('.toast-message');
            if (existingToast) existingToast.remove();
            
            const toast = document.createElement('div');
            toast.className = `toast-message toast-${type}`;
            toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> <span>${message}</span>`;
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 12px 20px;
                background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                color: white;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                animation: slideInRight 0.3s ease;
                font-family: 'Inter', sans-serif;
            `;
            
            if (!document.querySelector('#toast-animation-style')) {
                const style = document.createElement('style');
                style.id = 'toast-animation-style';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        
        showLoading(show) {
            const btn = document.querySelector('.login-btn');
            if (!btn) return;
            
            if (show) {
                btn.dataset.originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ingresando...';
                btn.disabled = true;
            } else {
                if (btn.dataset.originalText) {
                    btn.innerHTML = btn.dataset.originalText;
                }
                btn.disabled = false;
            }
        }
    }
    
    window.auth = new AuthManager();
})();