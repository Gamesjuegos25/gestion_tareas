import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('miembros')
export class Miembro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  puesto: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
