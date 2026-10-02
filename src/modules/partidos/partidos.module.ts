import { Module } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { PartidosController } from './partidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartidosPolitico } from 'src/common/db/partidos-politico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartidosPolitico])],
  controllers: [PartidosController],
  providers: [PartidosService],
})
export class PartidosModule {}
