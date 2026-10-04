import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Mesa } from './mesa.entity';

@Entity({ schema: 'dbo', name: 'ImagenesPlanillones' })
export class ImagenesPlanillone {
  @PrimaryGeneratedColumn('increment')
  IdImagen: number;

  @Column({ type: 'varchar', length: 10 })
  NumeroMesa: string;

  @Column({ type: 'varchar', length: 500 })
  RutaArchivo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  NombreOriginal?: string | null;

  @Column({ type: 'datetime', nullable: true })
  FechaSubida?: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public_id?: string | null;

  @ManyToOne(() => Mesa, (mesa) => mesa.imagenesPlanillones)
  @JoinColumn({ name: 'NumeroMesa' })
  mesa: Relation<Mesa>;
}
