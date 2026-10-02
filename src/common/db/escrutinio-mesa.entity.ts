import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Mesa } from './mesa.entity';
import { VotosCandidato } from './votos-candidato.entity';

@Entity({ schema: 'dbo', name: 'EscrutinioMesa' })
export class EscrutinioMesa {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  NumeroMesa: string;

  @Column({ type: 'int' })
  VotosBlancos: number;

  @Column({ type: 'int' })
  VotosNulos: number;

  @Column({ type: 'int' })
  VotosImpugnados: number;

  @Column({ type: 'int' })
  TotalCiudadanosVotaron: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  EstadoActa?: string | null;

  @Column({ type: 'datetime', nullable: true })
  FechaRegistro?: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  UsuarioRegistro?: string | null;

  @OneToMany(() => Mesa, (mesa) => mesa.escrutinioMesa)
  mesas: Mesa[];

  @Column({ type: 'int' })
  votosImpugnadosSp: number;

  @OneToMany(
    () => VotosCandidato,
    (votosCandidato) => votosCandidato.escrutinioMesa,
  )
  votosCandidatoes: VotosCandidato[];
}
