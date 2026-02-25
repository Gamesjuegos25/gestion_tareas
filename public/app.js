let registros = [];
let tablaSeleccionada = '';

// Cargar lista de tablas al iniciar
async function cargarTablas() {
  try {
    const response = await fetch('/api/tablas');
    if (!response.ok) throw new Error('Error al cargar tablas');
    const tablas = await response.json();
    
    const select = document.getElementById('tabla-select');
    select.innerHTML = '<option value="">-- Selecciona una tabla --</option>';
    
    tablas.forEach(tabla => {
      const option = document.createElement('option');
      option.value = tabla.nombre;
      option.textContent = `${tabla.nombre} (${tabla.cantidad} registros)`;
      select.appendChild(option);
    });

    if (tablas.length > 0) {
      select.value = tablas[0].nombre;
      cargarRegistros(tablas[0].nombre);
    }
  } catch (error) {
    console.error(error);
    mostrarError('No se pudieron cargar las tablas');
  }
}

// Cargar registros de una tabla específica
async function cargarRegistros(tabla) {
  if (!tabla) {
    limpiarRegistros();
    return;
  }

  tablaSeleccionada = tabla;
  try {
    const response = await fetch(`/api/registros/${tabla}`);
    if (!response.ok) throw new Error('Error al cargar registros');
    registros = await response.json();
    renderizarRegistros();
    actualizarStats();
    actualizarTablaInfo();
  } catch (error) {
    console.error(error);
    mostrarError('No se pudieron cargar los registros');
  }
}

function renderizarRegistros() {
  const container = document.getElementById('registros-list');

  if (registros.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <p>No hay registros en esta tabla</p>
      </div>
    `;
    return;
  }

  container.innerHTML = registros.map(registro => `
    <div class="registro-item ${registro.estado === 'Completada' ? 'completed' : ''}">
      <span class="registro-id">#${registro.id}</span>
      <span class="registro-desc">${escapeHtml(registro.descripcion)}</span>
      ${registro.estado ? `<span class="registro-estado ${registro.estado === 'Completada' ? 'completada' : ''}">${registro.estado}</span>` : ''}
      <button class="registro-btn-delete" onclick="eliminarRegistro('${tablaSeleccionada}', ${registro.id})">
        ❌ Eliminar
      </button>
    </div>
  `).join('');
}

function actualizarStats() {
  const total = registros.length;
  const completadas = registros.filter(r => r.estado === 'Completada').length;
  const pendientes = total - completadas;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-completadas').textContent = completadas;
  document.getElementById('stat-pendientes').textContent = pendientes;
}

function actualizarTablaInfo() {
  const info = document.getElementById('tabla-info');
  info.textContent = `${registros.length} registros`;
}

function limpiarRegistros() {
  document.getElementById('registros-list').innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📋</div>
      <p>Selecciona una tabla</p>
    </div>
  `;
  document.getElementById('stat-total').textContent = '0';
  document.getElementById('stat-completadas').textContent = '0';
  document.getElementById('stat-pendientes').textContent = '0';
  document.getElementById('tabla-info').textContent = '-';
}

async function eliminarRegistro(tabla, id) {
  if (!confirm('¿Estás seguro de que deseas ELIMINAR este registro?')) {
    return;
  }

  try {
    const response = await fetch(`/api/registros/${tabla}/${id}`, { method: 'DELETE' });

    if (!response.ok) throw new Error('Error al eliminar registro');

    await cargarRegistros(tabla);
    mostrarExito('Registro eliminado correctamente');
  } catch (error) {
    console.error(error);
    mostrarError('No se pudo eliminar el registro');
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function mostrarError(mensaje) {
  const container = document.getElementById('mensaje-container');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-msg';
  errorDiv.textContent = '❌ ' + mensaje;
  container.innerHTML = '';
  container.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000);
}

function mostrarExito(mensaje) {
  const container = document.getElementById('mensaje-container');
  const successDiv = document.createElement('div');
  successDiv.className = 'success-msg';
  successDiv.textContent = '✅ ' + mensaje;
  container.innerHTML = '';
  container.appendChild(successDiv);
  setTimeout(() => successDiv.remove(), 2000);
}

// Event listener para cambio de tabla
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('tabla-select');
  select.addEventListener('change', (e) => {
    cargarRegistros(e.target.value);
  });
  
  cargarTablas();
});
