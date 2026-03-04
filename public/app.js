const out = document.getElementById('out');
const tabsContainer = document.getElementById('tabs');
const countBadge = document.getElementById('count-badge');

// Cargar los estados disponibles al iniciar la página
async function loadStatuses() {
  try {
    const res = await fetch('/api/statuses');
    if (!res.ok) {
      const err = await res.json();
      out.textContent = 'Error al cargar estados: ' + (err.error || res.statusText);
      return;
    }
    const statuses = await res.json();
    renderStatusTabs(statuses);
  } catch (e) {
    out.textContent = 'Error de conexión al cargar estados: ' + e.message;
  }
}

// Renderizar los estados como botones
function renderStatusTabs(statuses) {
  tabsContainer.innerHTML = '';
  
  if (!statuses || statuses.length === 0) {
    tabsContainer.innerHTML = '<button class="tab-btn" disabled>No hay estados disponibles</button>';
    return;
  }
  
  statuses.forEach((status, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn';
    btn.textContent = status || '(vacío)';
    btn.onclick = () => selectStatus(status, btn);
    tabsContainer.appendChild(btn);
    // Auto-seleccionar el primer estado
    if (idx === 0) {
      setTimeout(() => selectStatus(status, btn), 300);
    }
  });
}

// Seleccionar un estado y buscar tareas
async function selectStatus(status, btn) {
  // Marcar como activo
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  // Buscar tareas
  searchTasks(status);
}

// Buscar tareas por estado
async function searchTasks(status) {
  const params = new URLSearchParams();
  params.set('status', status);
  
  out.textContent = 'Cargando...';
  
  try {
    const res = await fetch('/api/tasks?' + params.toString());
    if (!res.ok) {
      const err = await res.json();
      out.classList.add('error');
      out.textContent = 'Error: ' + (err.error || res.statusText);
      countBadge.textContent = '0';
      return;
    }
    const data = await res.json();
    out.classList.remove('error');
    countBadge.textContent = data.length;
    
    if (data.length === 0) {
      out.textContent = 'No hay tareas en este estado.';
      return;
    }
    
    // Formatear tareas como lista legible
    let html = '';
    data.forEach(task => {
      html += `
<div style="margin-bottom: 16px; padding: 12px; border-left: 4px solid #667eea; background: #f8f9fa; border-radius: 4px;">
  <strong style="font-size: 16px; color: #333;">${escapeHtml(task.titulo)}</strong>
  <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">${escapeHtml(task.descripcion || '(sin descripción)')}</p>
  <small style="color: #999;">ID: ${task.id}</small>
</div>
      `;
    });
    out.innerHTML = html;
  } catch (e) {
    out.classList.add('error');
    out.textContent = 'Error de conexión: ' + e.message;
    countBadge.textContent = '0';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Cargar estados al iniciar
loadStatuses();
