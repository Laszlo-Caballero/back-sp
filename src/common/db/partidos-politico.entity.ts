import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Candidato } from './candidato.entity';

@Entity({ schema: 'dbo', name: 'PartidosPoliticos' })
export class PartidosPolitico {
  @PrimaryGeneratedColumn('increment')
  IdPartido: number;

  @Column({ type: 'varchar', length: 100 })
  NombrePartido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  Siglas?: string | null;

  @OneToMany(() => Candidato, (candidato) => candidato.partidosPolitico)
  candidatos: Candidato[];
}
