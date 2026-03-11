import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tareas')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  proyecto_id: number;

  @Column({ type: 'bigint', nullable: true })
  miembro_id: number;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date', nullable: true })
  fecha_limite: Date;

  @Column({ type: 'bigint', nullable: true })
  estado_id: number;

  @Column({ type: 'bigint', nullable: true })
  prioridad_id: number;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}