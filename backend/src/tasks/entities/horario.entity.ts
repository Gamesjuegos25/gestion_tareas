import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('horarios')
export class Horario {
  // Configurado como GENERATED ALWAYS según tu base de datos
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ name: 'tarea_id' })
  tarea_id: number;

  @Column({ type: 'timestamptz' })
  inicio: Date;

  @Column({ type: 'timestamptz' })
  fin: Date;

  @Column({ type: 'varchar', length: 20, default: 'Planificado' })
  tipo: string;

  // Relación: Muchos horarios pertenecen a una Tarea
  @ManyToOne(() => Task, (task) => task.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tarea_id' })
  tarea: Task;
}