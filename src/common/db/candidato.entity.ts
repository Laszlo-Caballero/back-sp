import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { PartidosPolitico } from './partidos-politico.entity';
import { VotosCandidato } from './votos-candidato.entity';

@Entity({ schema: 'dbo', name: 'Candidatos' })
export class Candidato {
  @PrimaryGeneratedColumn('increment')
  IdCandidato: number;

  @Column({ type: 'varchar', length: 150 })
  NombreCompleto: string;

  @Column({ type: 'int' })
  IdPartido: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  CargoPostulacion?: string | null;

  @ManyToOne(
    () => PartidosPolitico,
    (partidosPolitico) => partidosPolitico.candidatos,
  )
  @JoinColumn({ name: 'IdPartido' })
  partidosPolitico: Relation<PartidosPolitico>;

  @OneToMany(() => VotosCandidato, (votosCandidato) => votosCandidato.candidato)
  votosCandidatoes: VotosCandidato[];
}
