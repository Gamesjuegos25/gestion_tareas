const assert = require('assert');
const tareasModule = require('../dist/tareas');

// Copia de seguridad del estado inicial
const inicial = tareasModule.listarTareas();
assert.strictEqual(inicial.length, 3, 'Debe haber 3 tareas inicialmente');

// Probar eliminar
const eliminado = tareasModule.eliminarTarea(2);
assert.strictEqual(eliminado, true, 'La tarea 2 debe eliminarse');
const despuesEliminar = tareasModule.listarTareas();
assert.strictEqual(despuesEliminar.length, 2, 'Debe quedar 2 tareas después de eliminar');

// Probar agregar
const nueva = tareasModule.agregarTarea('Prueba de integración');
assert.strictEqual(typeof nueva.id, 'number');
assert.strictEqual(nueva.descripcion, 'Prueba de integración');

console.log('Todas las pruebas pasaron.');
