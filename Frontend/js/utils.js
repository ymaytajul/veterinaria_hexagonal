/**
 * Utilidades compartidas de UI.
 */

function showAlert(container, message, type = 'info') {
    if (!container) return;

    container.hidden = false;
    container.className = `alert alert--${type}`;
    container.textContent = message;
}

function hideAlert(container) {
    if (!container) return;
    container.hidden = true;
    container.textContent = '';
}

function formatEstado(estado) {
    const labels = {
        pendiente: 'Pendiente',
        confirmada: 'Confirmada',
        cancelada: 'Cancelada',
    };
    return labels[estado] || estado;
}

function estadoBadgeClass(estado) {
    return `badge badge--${estado || 'pendiente'}`;
}
