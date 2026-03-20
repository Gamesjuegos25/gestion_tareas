import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

import { EditarTareaDto } from '../editartarea.dto'; 
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // 👇 --- NUEVAS FUNCIONES AUXILIARES PARA EL HISTORIAL (FLUJOS) --- 👇
  private obtenerDatosFecha() {
    const now = new Date();
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    // Cálculo preciso de la semana del año
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000);
    const oneDay = 1000 * 60 * 60 * 24;
    const semana = Math.ceil(Math.floor(diff / oneDay) / 7);

    return {
      fecha: now,
      dia_semana: dias[now.getDay()],
      semana: semana,
      mes: now.getMonth() + 1,
      anio: now.getFullYear()
    };
  }

  private obtenerPorcentaje(estadoId: number) {
    if (estadoId === 1) return 30.00;  // To Do = 30%
    if (estadoId === 2) return 60.00;  // In Progress = 60%
    if (estadoId === 3) return 100.00; // Done = 100%
    return 0.00;
  }

  //------------ backend modificacion para problema de fecha anterior parse--

  private parseDateString(value: any): Date { //parse local de la fecha, para evitar problemas de zona horaria
    if (!value) return new Date();
    if (value instanceof Date) return value;
    const s = String(value);


    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(s);
    if (dateOnly) {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    if (s.includes('T')) {

      //si contiene info de zona horaria (Z o +hh o -hh) usar parseo nativo
      if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)) { 
        return new Date(s);
      }

      // no zona horaria -> parse como local
      try {
        const [datePart, timePart] = s.split('T');
        const [y, m, d] = datePart.split('-').map(Number);
        const time = timePart.split(':').map(tp => Number(tp));
        const hh = time[0] || 0;
        const mm = time[1] || 0;
        const ss = Math.floor(time[2] || 0);
        return new Date(y, m - 1, d, hh, mm, ss);
      } catch (e) {
        return new Date(s);
      }
    }

    return new Date(s);
  }
  //  ------------------------------------------------------------- 

  // 1. LEER TODAS LAS TAREAS (¡Ahora traemos también sus horarios y flujos!)
  findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      order: { fecha_limite: 'ASC' },
      relations: ['horarios', 'flujos'], // <-- AHORA INCLUYE LOS FLUJOS
    });
  }

  // 2. BUSCAR UNA TAREA POR ID
  findOne(id: number) {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['horarios', 'flujos'], // <-- AHORA INCLUYE LOS FLUJOS
    });
  }

  // 3. CREAR UNA NUEVA TAREA (Aceptando horarios e iniciando historial)
  async create(datos: CreateTaskDto & { estado_id?: number; prioridad_id?: number }) {
    try {
      console.log('📥 Datos recibidos del frontend:', datos);

      //--------Backend Modificacion para replicar validaciones del frontend en caso de que el frontend no las ejecute por alguna razon
      // Validaciones de negocio replicando las reglas del frontend
      // 1) Descripción debe empezar por letra y contener sólo caracteres permitidos
      const desc = String(datos.description || '');
      const descripcionPermitida = /^[A-Za-zÁÉÍÓÚáéíóúÑñ][A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\-\.,:;?()]*$/;
      if (!descripcionPermitida.test(desc)) {
        throw new BadRequestException('La descripción debe empezar con una letra y contener sólo caracteres permitidos.');
      }

      // 2) La fecha límite no puede ser anterior a hoy (comparación por fecha local)
      if (datos.dueDate) {
        const inputDate = this.parseDateString(datos.dueDate);
        const today = new Date();
        const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const inputDateLocal = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
        if (inputDateLocal.getTime() < todayLocal.getTime()) {
          throw new BadRequestException('La fecha no puede ser anterior a hoy');
        }
      }

      // 3) Validaciones sobre horarios (si vienen en la petición)
      if (Array.isArray(datos.horarios)) {
        const now = new Date();
        const nowRounded = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0);
        for (const h of datos.horarios) {
          const inicio = this.parseDateString(h.inicio);
          const fin = this.parseDateString(h.fin);

          // Prohibir fin a las 00:00 (sería el siguiente día)
          if (fin.getHours() === 0 && fin.getMinutes() === 0 && fin.getSeconds() === 0) {
            throw new BadRequestException('La hora de fin no puede ser doce AM (sería del día siguiente).');
          }

          // Asegurar que fin > inicio
          if (fin.getTime() <= inicio.getTime()) {
            throw new BadRequestException('La hora de fin debe ser posterior a la de inicio.');
          }

          // Si la fecha límite es hoy, la hora de inicio no puede ser anterior a ahora
          if (datos.dueDate) {
            const fechaLim = this.parseDateString(datos.dueDate);
            const fechaLimLocal = new Date(fechaLim.getFullYear(), fechaLim.getMonth(), fechaLim.getDate());
            const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (fechaLimLocal.getTime() === todayLocal.getTime()) {
              if (inicio.getTime() < nowRounded.getTime()) {
                throw new BadRequestException('La hora de inicio no puede ser anterior a la hora actual cuando la fecha es hoy.');
              }
            }
          }
        }
      }
      //----------

      // Determinamos el estado inicial para poder calcular el avance
      const estadoInicial = datos.estado ? Number(datos.estado) : (datos.estado_id || 1);
      const datosTiempo = this.obtenerDatosFecha();

      const nuevaTarea = this.taskRepository.create({
        titulo: datos.title || 'Nueva tarea',
        descripcion: datos.description || 'Sin descripción',
        fecha_limite: datos.dueDate ? this.parseDateString(datos.dueDate) : new Date(),
        estado_id: estadoInicial,
        prioridad_id: datos.prioridad_id ? Number(datos.prioridad_id) : 2,
        
        // Mapeamos los horarios si vienen en la petición
        horarios: datos.horarios ? datos.horarios.map(h => ({
          inicio: this.parseDateString(h.inicio),
          fin: this.parseDateString(h.fin),
          tipo: h.tipo || 'Planificado'
        })) : [],

        // 👇 CREAMOS EL PRIMER REGISTRO DE FLUJO (Ej: 30% al crear en To Do) 👇
        flujos: [{
          fecha: datosTiempo.fecha,
          dia_semana: datosTiempo.dia_semana,
          semana: datosTiempo.semana,
          mes: datosTiempo.mes,
          anio: datosTiempo.anio,
          estado_id: estadoInicial,
          porcentaje_avance: this.obtenerPorcentaje(estadoInicial),
          observacion: 'Tarea creada'
        }]
      });

      console.log('🛠️ Tarea armada para TypeORM:', nuevaTarea);

      return await this.taskRepository.save(nuevaTarea);
      
    } catch (error) {
      console.error('❌ Error al crear tarea:', error);
      throw new InternalServerErrorException('Error al crear la tarea en la base de datos');
    }
  }

  // 4. ACTUALIZAR Y MOVER TAREA 
  async update(id: number, datos: EditarTareaDto & { estado_id?: number; prioridad_id?: number; horarios?: any[] }) {
    
    // Traemos la tarea actual JUNTO con sus horarios y flujos
    const tareaActual = await this.taskRepository.findOne({
      where: { id },
      relations: ['horarios', 'flujos'] // <-- INCLUIMOS FLUJOS AQUÍ
    });

    if (!tareaActual) return null;

    // 👇 VARIABLES PARA DETECTAR SI LA TAREA CAMBIÓ DE COLUMNA 👇
    let cambioDeEstado = false;
    let nuevoEstado = Number(tareaActual.estado_id);

    if (datos.estado_id && Number(datos.estado_id) !== Number(tareaActual.estado_id)) {
      cambioDeEstado = true;
      nuevoEstado = Number(datos.estado_id);
      tareaActual.estado_id = nuevoEstado;
    }

    // Actualizamos propiedades básicas
    if (datos.titulo) tareaActual.titulo = datos.titulo;
    if (datos.descripcion) tareaActual.descripcion = datos.descripcion;
    if (datos.prioridad_id) tareaActual.prioridad_id = Number(datos.prioridad_id);

    // Actualizamos fecha límite
    if (datos.fechaLimite) {
      tareaActual.fecha_limite = this.parseDateString(datos.fechaLimite);
      const vencimientoTarea = this.parseDateString(datos.fechaLimite);
      const fechaActual = new Date();
      
      if (vencimientoTarea < fechaActual) {
        console.log(`⚠️ ALERTA: La tarea "${datos.titulo || tareaActual.titulo}" ya ha vencido.`);
      }
    }

    // ACTUALIZAMOS LOS HORARIOS
    if (datos.horarios) {
      tareaActual.horarios = datos.horarios.map(h => ({
        inicio: this.parseDateString(h.inicio),
        fin: this.parseDateString(h.fin),
        tipo: h.tipo || 'Planificado'
      })) as any; 
    }

    // 👇 SI HUBO CAMBIO DE COLUMNA, AGREGAMOS EL REGISTRO AL HISTORIAL 👇
    if (cambioDeEstado) {
      const datosTiempo = this.obtenerDatosFecha();
      
      const nuevoFlujo = {
        fecha: datosTiempo.fecha,
        dia_semana: datosTiempo.dia_semana,
        semana: datosTiempo.semana,
        mes: datosTiempo.mes,
        anio: datosTiempo.anio,
        estado_id: nuevoEstado,
        porcentaje_avance: this.obtenerPorcentaje(nuevoEstado),
        observacion: `Movida a la columna ${nuevoEstado}`
      };

      // Si por alguna razón la tarea no tenía flujos antes, inicializamos el arreglo
      if (!tareaActual.flujos) tareaActual.flujos = [];
      tareaActual.flujos.push(nuevoFlujo as any);
    }

    return await this.taskRepository.save(tareaActual);
  }

  // 5. ELIMINAR TAREA
  async remove(id: number) {
    await this.taskRepository.delete(id);
    return { deleted: true };
  }
}