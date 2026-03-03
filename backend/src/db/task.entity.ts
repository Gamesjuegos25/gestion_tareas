import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tareas')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column({ type: 'date', name: 'fecha_limite' })
  fechaEntrega: string;

  @Column({ name: 'estado_id', nullable: true })
  estadoId?: number;

  @Column({ name: 'prioridad_id', nullable: true })
  prioridadId?: number;

  @Column({ name: 'proyecto_id', nullable: true })
  proyectoId?: number;

  @Column({ name: 'miembro_id', nullable: true })
  miembroId?: number;
}