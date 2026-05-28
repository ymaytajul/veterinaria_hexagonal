document.addEventListener('DOMContentLoaded', () => {
    const role = document.body.dataset.role || 'cliente';
    const form = document.getElementById('form-cita');
    const tablaBody = document.querySelector('#tabla-citas tbody');
    const alertBox = document.getElementById('alert-citas');
    const btnRecargar = document.getElementById('btn-recargar');

    async function cargarCitas() {
        hideAlert(alertBox);
        tablaBody.innerHTML = '<tr><td colspan="7" class="muted">Cargando...</td></tr>';

        try {
            const citas = await CitasApi.listar();
            renderTabla(citas);
        } catch (error) {
            tablaBody.innerHTML = '';
            showAlert(alertBox, error.message, 'error');
        }
    }

    function renderTabla(citas) {
        if (!citas.length) {
            tablaBody.innerHTML = '<tr><td colspan="7" class="muted">No hay citas registradas.</td></tr>';
            return;
        }

        tablaBody.innerHTML = citas
            .map((cita) => {
                const acciones = renderAcciones(cita);
                return `
                    <tr>
                        <td>${cita.id ?? '—'}</td>
                        <td>${escapeHtml(cita.cliente_nombre)}</td>
                        <td>${escapeHtml(cita.mascota_nombre)}</td>
                        <td>${escapeHtml(cita.fecha)}</td>
                        <td>${escapeHtml(cita.hora)}</td>
                        <td><span class="${estadoBadgeClass(cita.estado)}">${formatEstado(cita.estado)}</span></td>
                        <td class="actions">${acciones}</td>
                    </tr>
                `;
            })
            .join('');
    }

    function renderAcciones(cita) {
        if (role !== 'admin') {
            return '<span class="muted">Solo lectura</span>';
        }

        if (!cita.id) return '<span class="muted">Sin ID</span>';

        const botones = [];

        if (cita.estado === 'pendiente') {
            botones.push(
                `<button type="button" class="btn btn--small btn--primary" data-action="confirmar" data-id="${cita.id}">Confirmar</button>`
            );
            botones.push(
                `<button type="button" class="btn btn--small btn--danger" data-action="cancelar" data-id="${cita.id}">Cancelar</button>`
            );
        }

        if (!botones.length) {
            return '<span class="muted">—</span>';
        }

        return botones.join(' ');
    }

    function escapeHtml(text) {
        return String(text ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');
    }

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            hideAlert(alertBox);

            const payload = {
                cliente_nombre: form.cliente_nombre.value.trim(),
                mascota_nombre: form.mascota_nombre.value.trim(),
                fecha: form.fecha.value,
                hora: form.hora.value,
            };

            try {
                await CitasApi.crear(payload);
                form.reset();
                showAlert(alertBox, 'Cita creada correctamente.', 'success');
                await cargarCitas();
            } catch (error) {
                showAlert(alertBox, error.message, 'error');
            }
        });
    }

    tablaBody.addEventListener('click', async (event) => {
        if (role !== 'admin') return;

        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;

        hideAlert(alertBox);
        button.disabled = true;

        try {
            if (action === 'confirmar') {
                await CitasApi.confirmar(id);
                showAlert(alertBox, `Cita #${id} confirmada.`, 'success');
            } else if (action === 'cancelar') {
                await CitasApi.cancelar(id);
                showAlert(alertBox, `Cita #${id} cancelada.`, 'success');
            }
            await cargarCitas();
        } catch (error) {
            showAlert(alertBox, error.message, 'error');
        } finally {
            button.disabled = false;
        }
    });

    btnRecargar.addEventListener('click', cargarCitas);
    cargarCitas();
});
