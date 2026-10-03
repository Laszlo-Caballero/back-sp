import { Controller, Get } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { Auth } from '../../common/decorator/auth/auth.decorator';

@Auth()
@Controller('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) {}

  @Get()
  getPartidos() {
    return this.partidosService.getPartidos();
  }
}
