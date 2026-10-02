import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { Candidato } from './candidato.entity';
import { EscrutinioMesa } from './escrutinio-mesa.entity';

@Entity({ schema: 'dbo', name: 'VotosCandidato' })
export class VotosCandidato {
  @PrimaryGeneratedColumn('increment')
  IdVoto: number;

  @Column({ type: 'varchar', length: 10 })
  NumeroMesa: string;

  @Column({ type: 'int' })
  IdCandidato: number;

  @Column({ type: 'int' })
  CantidadVotos: number;

  @ManyToOne(() => Candidato, (candidato) => candidato.votosCandidatoes)
  @JoinColumn({ name: 'IdCandidato' })
  candidato: Relation<Candidato>;

  @ManyToOne(
    () => EscrutinioMesa,
    (escrutinioMesa) => escrutinioMesa.votosCandidatoes,
  )
  @JoinColumn({ name: 'NumeroMesa' })
  escrutinioMesa: Relation<EscrutinioMesa>;
}
