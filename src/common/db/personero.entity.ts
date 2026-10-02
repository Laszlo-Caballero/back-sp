import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  type Relation,
} from 'typeorm';
import { Mesa } from './mesa.entity';

@Entity({ schema: 'dbo', name: 'Personeros' })
export class Personero {
  @PrimaryColumn({ type: 'varchar', length: 8 })
  DNI: string;

  @Column({ type: 'varchar', length: 150 })
  NombreCompleto: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  Celular?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  Contrasena?: string | null;

  @OneToOne(() => Mesa, (mesa) => mesa.personero)
  mesa: Relation<Mesa>;
}
