import { listarTareas, eliminarTarea } from './tareas';

function mostrarUso() {
  console.log('Uso:');
  console.log('  npm run build && npm start -- listar');
  console.log('  npm run build && npm start -- eliminar <id>');
}

const proc = (globalThis as any).process;
const args: string[] = proc?.argv?.slice(2) ?? [];

(async () => {
  if (args.length === 0) {
    mostrarUso();
    proc?.exit?.(0);
  }

  const comando = args[0];
  try {
    if (comando === 'listar') {
      const lista = await listarTareas();
      if (!lista.length) {
        console.log('No hay tareas.');
      } else {
        lista.forEach(t => console.log(`${t.id}. [${t.estado}] ${t.descripcion}`));
      }
    } else if (comando === 'eliminar') {
      const id = Number(args[1]);
      if (!Number.isInteger(id)) {
        console.log('ID inválido. Debe indicar un número entero.');
        proc?.exit?.(1);
      }
      const ok = await eliminarTarea(id);
      console.log(ok ? `Tarea ${id} eliminada.` : `La tarea con id ${id} no existe.`);
    } else {
      mostrarUso();
      proc?.exit?.(1);
    }
  } catch (err) {
    console.error('Error ejecutando comando:', err);
    proc?.exit?.(1);
  }
})();
