import { Controller, Get, Param } from '@nestjs/common';
import { MesaService } from './mesa.service';

@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Get('/:nroMesa')
  getMesaByNro(@Param('nroMesa') nroMesa: string) {
    return this.mesaService.getMesaByNro(nroMesa);
  }
}
