/**
 * Registro de mascotas — preparado para cuando exista la API.
 * Hoy el backend (GestionMascotas / MascotaController) está pendiente (ver README).
 */

document.addEventListener('DOMContentLoaded', () => {
    const role = document.body.dataset.role || 'cliente';
    const form = document.getElementById('form-mascota');
    const alertBox = document.getElementById('alert-mascotas');
    const roleText = role === 'admin' ? 'administrador' : 'cliente';

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        showAlert(
            alertBox,
            `La API de mascotas aún no está disponible. Vista activa para ${roleText}. Se conectará cuando backend exponga endpoints de mascotas.`,
            'info'
        );
    });
});
