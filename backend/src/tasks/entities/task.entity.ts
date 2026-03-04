import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// Le indicamos que se conecte a la tabla 'tareas' que ya existe
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

  // ¡Aquí está el famoso estado_id! Es un número.
  @Column({ type: 'bigint', nullable: true })
  estado_id: number;

  @Column({ type: 'bigint', nullable: true })
  prioridad_id: number;

  // Enlazamos el nombre exacto de la columna en BD (creado_en)
  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  // Enlazamos el nombre exacto de la columna en BD (actualizado_en)
  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizado_en: Date;
}