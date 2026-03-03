import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tareas')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column({ type: 'date', name: 'fecha_entrega' })
  fechaEntrega: string;

  @Column({ length: 50 })
  dificultad: string;

  @Column({ length: 50 })
  columna: string;
}
