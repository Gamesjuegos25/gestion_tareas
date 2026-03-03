import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prioridades')
export class Prioridad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  nombre: string;
}
