import { buscarTareas, agregarTarea, toggleTarea, listarTareas } from "./tareas";
import { inicializarDB, cerrarConexion } from "./database";

async function main() {
  try {
    // Inicializar la base de datos
    await inicializarDB();

    console.log("-- Buscar 'comida' --");
    console.log(await buscarTareas("comida"));

    console.log("\n-- Buscar 'ejercicio' --");
    console.log(await buscarTareas("ejercicio"));

    console.log("\n-- Agregar nueva tarea y listar --");
    await agregarTarea("Llamar al banco");
    console.log(await listarTareas());

    console.log("\n-- Cambiar estado de la tarea id=1 y mostrar --");
    await toggleTarea(1);
    console.log(await listarTareas());
  } catch (error) {
    console.error("Error en la aplicación:", error);
  } finally {
    await cerrarConexion();
  }
}

main();
