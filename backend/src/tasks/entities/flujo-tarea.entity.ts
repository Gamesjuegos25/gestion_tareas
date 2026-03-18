import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('flujo_tareas')
export class FlujoTarea {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'tarea_id' })
  tarea_id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', length: 30, nullable: true })
  codigo_tarea: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  dia_semana: string;

  @Column({ type: 'int4' })
  semana: number;

  @Column({ type: 'int4' })
  mes: number;

  @Column({ type: 'int4' })
  anio: number;

  @Column({ name: 'estado_id', type: 'int8', nullable: true })
  estado_id: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  porcentaje_avance: number;

  @Column({ type: 'text', nullable: true })
  observacion: string;

  // Relación: Muchos flujos pertenecen a una Tarea
  @ManyToOne(() => Task, (task) => task.flujos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tarea_id' })
  tarea: Task;
}