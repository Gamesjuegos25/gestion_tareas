import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tarea } from './tarea.entity';
import { EstadoTarea } from './estado-tarea.entity';

@Entity('flujo_tareas')
export class FlujoTarea {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tarea, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tarea_id' })
  tarea: Tarea;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ length: 30, unique: true, nullable: true })
  codigoTarea: string;

  @Column({ type: 'enum', enum: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'], nullable: true })
  diaSemana: string;

  @Column()
  semana: number;

  @Column()
  mes: number;

  @Column()
  anio: number;

  @ManyToOne(() => EstadoTarea)
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoTarea;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  porcentajeAvance: number;

  @Column('text', { nullable: true })
  observacion: string;
}
