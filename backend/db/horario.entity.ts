import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tarea } from './tarea.entity';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tarea, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tarea_id' })
  tarea: Tarea;

  @Column({ type: 'timestamp' })
  inicio: Date;

  @Column({ type: 'timestamp' })
  fin: Date;

  @Column({ type: 'enum', enum: ['Planificado', 'Real', 'Reprogramado'], default: 'Planificado' })
  tipo: 'Planificado' | 'Real' | 'Reprogramado';
}
