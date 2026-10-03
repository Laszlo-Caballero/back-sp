import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VotosService } from './votos.service';
import { Auth } from '../../common/decorator/auth/auth.decorator';
import { RegistroVotosDto } from './dto/registrar-votos.dto';
import { User } from '../../common/decorator/user/user.decorator';
import type { JwtPayload } from '../../common/interfaces/interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { QueryDto } from './dto/query.dto';

@Auth()
@Controller('votos')
export class VotosController {
  constructor(private readonly votosService: VotosService) {}

  @Post('registrar')
  registrarVotos(@Body() votos: RegistroVotosDto, @User() user: JwtPayload) {
    return this.votosService.registrarVotos(votos, user);
  }

  @Get('ver-acta-cerrada/:nroMesa')
  verActaCerrada(@Param('nroMesa') nroMesa: string) {
    return this.votosService.verActaCerrada(nroMesa);
  }

  @Post('subir-actas/:nroMesa')
  @UseInterceptors(FilesInterceptor('files'))
  subirActas(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('nroMesa') nroMesa: string,
  ) {
    return this.votosService.subirActas(files, nroMesa);
  }

  @Get('get-actas/:nroMesa')
  getActas(@Param('nroMesa') nroMesa: string) {
    return this.votosService.getActas(nroMesa);
  }

  @Get('resumen')
  resumen(@Query() dto: QueryDto) {
    return this.votosService.resumen(dto);
  }

  @Get('resumen-general')
  getResumenGeneral() {
    return this.votosService.getResumenGeneral();
  }
}
