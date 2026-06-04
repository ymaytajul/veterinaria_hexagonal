/**
 * Sistema de Autenticacion - MODO DEMO COMPLETO
 * NO necesita backend - funciona con localStorage
 */

(function initAuth() {
    // ========================================
    // MODO DEMO - Credenciales hardcodeadas
    // ========================================
    const DEMO_USERS = {
        'admin@vet.com': { 
            password: 'admin123', 
            role: 'admin', 
            id: 1, 
            name: 'Administrador',
            token: 'demo-token-admin-123'
        },
        'cliente@vet.com': { 
            password: 'cliente123', 
            role: 'cliente', 
            id: 2, 
            name: 'Cliente Demo',
            token: 'demo-token-cliente-456'
        }
    };
    
    // Obtener URL base para redirecciones
    const path = window.location.pathname;
    const projectBase = path.includes('/Frontend/')
        ? path.split('/Frontend/')[0]
        : path.replace(/\/[^/]*$/, '');
    
    window.FRONTEND_BASE = `${projectBase}/Frontend`;
    
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
        
        async login(email, password) {
            try {
                this.showLoading(true);
                
                // Simular delay de red
                await this.delay(600);
                
                const user = DEMO_USERS[email];
                
                if (user && user.password === password) {
                    // Guardar sesion
                    localStorage.setItem('auth_token', user.token);
                    localStorage.setItem('user_role', user.role);
                    localStorage.setItem('user_id', user.id);
                    localStorage.setItem('user_name', user.name);
                    
                    this.showToast(`✅ Bienvenido, ${user.name}!`, 'success');
                    
                    setTimeout(() => {
                        if (user.role === 'admin') {
                            window.location.href = `${window.FRONTEND_BASE}/admin/dashboard.html`;
                        } else {
                            window.location.href = `${window.FRONTEND_BASE}/cliente/dashboard.html`;
                        }
                    }, 500);
                    return true;
                } else {
                    this.showToast('❌ Credenciales incorrectas', 'error');
                    return false;
                }
                
            } catch (error) {
                console.error('Error en login:', error);
                this.showToast('Error de conexion', 'error');
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
        
        redirectToLogin() {
            window.location.href = `${window.FRONTEND_BASE}/login.html`;
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
            toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 12px 20px;
                background: ${type === 'success' ? '#10b981' : '#ef4444'};
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