import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { Auth } from 'src/common/decorator/auth/auth.decorator';
import { MesaDto } from './dto/mesa.dto';

@Auth()
@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Get('/:nroMesa')
  getMesaByNro(@Param('nroMesa') nroMesa: string) {
    return this.mesaService.getMesaByNro(nroMesa);
  }

  @Post('')
  createMesa(@Body() createMesaDto: MesaDto) {
    return this.mesaService.createMesa(createMesaDto);
  }
}
