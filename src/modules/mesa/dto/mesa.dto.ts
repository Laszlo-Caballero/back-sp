import { IsNumber, IsString } from 'class-validator';

export class MesaDto {
  @IsString()
  nroMesa: string;

  @IsString()
  distrito: string;

  @IsNumber()
  capacidad: number;
}
