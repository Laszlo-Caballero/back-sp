import {
  Body,
  Controller,
  Get,
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

  @Get('ver-acta-cerrada')
  verActaCerrada(@User() user: JwtPayload) {
    return this.votosService.verActaCerrada(user);
  }

  @Post('subir-actas')
  @UseInterceptors(FilesInterceptor('files'))
  subirActas(
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: JwtPayload,
  ) {
    return this.votosService.subirActas(files, user);
  }

  @Get('get-actas')
  getActas(@User() user: JwtPayload) {
    return this.votosService.getActas(user);
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
