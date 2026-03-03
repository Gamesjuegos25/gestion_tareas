import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Proyecto } from './proyecto.entity';
import { Miembro } from './miembro.entity';
import { EstadoTarea } from './estado-tarea.entity';
import { Prioridad } from './prioridad.entity';

@Entity('tareas')
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Proyecto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'proyecto_id' })
  proyecto: Proyecto;

  @ManyToOne(() => Miembro, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'miembro_id' })
  miembro: Miembro;

  @Column({ length: 150 })
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column({ type: 'date', name: 'fecha_limite' })
  fechaLimite: string;

  @ManyToOne(() => EstadoTarea)
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoTarea;

  @ManyToOne(() => Prioridad)
  @JoinColumn({ name: 'prioridad_id' })
  prioridad: Prioridad;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}
