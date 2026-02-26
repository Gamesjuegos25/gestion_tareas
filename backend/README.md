Cambio de diseño de la base de datos

En el primer modelo teníamos 6 tablas, pero varias de ellas no eran tan necesarias para lo que el proyecto pide en esta etapa. Por ejemplo, se usaban 'listas', 'comentarios_tareas' y 'historial_tareas', que complicaban la estructura sin aportar mucho valor en el sprint actual.  

Al revisar, decidimos simplificar y reorganizar la base de datos:

- Tablas eliminadas:
  - listas: se quitó porque no era indispensable organizar las tareas en listas.  
  - comentarios_tareas: se eliminó para mantener el modelo más simple.  
  - historial_tareas: se reemplazó por flujo_tareas, que guarda mejor la evolución de las tareas.  

- Tablas nuevas: 
  - estados_tarea: catálogo para manejar los estados de las tareas (pendiente, en progreso, completada, etc.).  
  - prioridades: catálogo para manejar las prioridades (alta, media, baja).  

- Beneficios del cambio:
  - La base de datos ahora es más flexible: se pueden agregar nuevos estados o prioridades sin modificar la estructura.  
  - Se asegura integridad: solo se usan valores válidos gracias a las claves foráneas.  
  - Se simplificó el diseño eliminando tablas que no eran críticas.  
  - Se mejoró la trazabilidad con flujo_tareas, que permite ver cómo cambian las tareas en el tiempo.  

Si bien pasamos de un modelo con 6 tablas a uno con 7, pero más ordenado, fácil de mantener y preparado para crecer junto con el sistema.

