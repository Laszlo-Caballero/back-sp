import { Module } from '@nestjs/common';
import { VotosService } from './votos.service';
import { VotosController } from './votos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscrutinioMesa } from '../../common/db/escrutinio-mesa.entity';
import { VotosCandidato } from '../../common/db/votos-candidato.entity';
import { PartidosPolitico } from '../../common/db/partidos-politico.entity';
import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';
import { ImagenesPlanillone } from '../../common/db/imagenes-planillone.entity';
import { Mesa } from '../../common/db/mesa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EscrutinioMesa,
      VotosCandidato,
      PartidosPolitico,
      ImagenesPlanillone,
      Mesa,
    ]),
    CloudinaryModule,
  ],
  controllers: [VotosController],
  providers: [VotosService],
})
export class VotosModule {}
