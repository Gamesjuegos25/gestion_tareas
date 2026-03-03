import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados_tarea')
export class EstadoTarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  nombre: string;
}