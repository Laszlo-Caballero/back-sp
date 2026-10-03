import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MesaService } from './mesa.service';

@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Get('/:nroMesa')
  getMesaByNro(@Param('nroMesa', ParseIntPipe) nroMesa: number) {
    return this.mesaService.getMesaByNro(nroMesa);
  }
}
