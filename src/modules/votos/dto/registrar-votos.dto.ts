import { IsInt, IsObject, IsString } from 'class-validator';

export class VotosPartidosDto {
  [key: string]: number;
}

export class RegistroVotosDto {
  @IsInt()
  totalCiudadanos: number;

  @IsInt()
  votosBlanco: number;

  @IsInt()
  votosNulos: number;

  @IsInt()
  votosImpugnados: number;

  @IsInt()
  votosImpugnadosSp: number;

  @IsObject()
  votosPartidos: Record<string, number>;

  @IsString()
  nroMesa: string;
}
