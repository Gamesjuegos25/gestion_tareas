import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('proyectos')
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
