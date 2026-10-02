import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { Personero } from './personero.entity';
import { EscrutinioMesa } from './escrutinio-mesa.entity';
import { ImagenesPlanillone } from './imagenes-planillone.entity';

@Entity({ schema: 'dbo', name: 'Mesas' })
export class Mesa {
  @Column({ type: 'nvarchar', length: 510, nullable: true })
  Local?: string | null;

  @Column({ type: 'nvarchar', length: 510, nullable: true })
  Distrito?: string | null;

  @Column({ type: 'nvarchar', length: 510, nullable: true })
  Nombre_Local?: string | null;

  @Column({ type: 'nvarchar', length: 510, nullable: true })
  Direccion?: string | null;

  @PrimaryColumn({ type: 'varchar', length: 10 })
  Numero_Mesa: string;

  @Column({ type: 'float', nullable: true })
  Electores_Por_Mesa?: number | null;

  @Column({ type: 'varchar', length: 8, nullable: true })
  DNI_Personero?: string | null;

  @OneToOne(() => Personero, (personero) => personero.mesa)
  @JoinColumn({ name: 'DNI_Personero' })
  personero: Relation<Personero>;

  @ManyToOne(() => EscrutinioMesa, (escrutinioMesa) => escrutinioMesa.mesas)
  @JoinColumn({ name: 'Numero_Mesa' })
  escrutinioMesa: Relation<EscrutinioMesa>;

  @OneToMany(
    () => ImagenesPlanillone,
    (imagenesPlanillone) => imagenesPlanillone.mesa,
  )
  imagenesPlanillones: ImagenesPlanillone[];
}
