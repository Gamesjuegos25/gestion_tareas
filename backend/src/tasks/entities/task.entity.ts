import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tareas')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  fecha_limite: string;

  @Column({ nullable: true })
  estado_id: number;

  @Column({ nullable: true })
  prioridad_id: number;

  @Column({ nullable: true })
  proyecto_id: number;

  @Column({ nullable: true })
  miembro_id: number;
}