import { Module } from '@nestjs/common';
import { VotosService } from './votos.service';
import { VotosController } from './votos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscrutinioMesa } from 'src/common/db/escrutinio-mesa.entity';
import { VotosCandidato } from 'src/common/db/votos-candidato.entity';
import { PartidosPolitico } from 'src/common/db/partidos-politico.entity';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { ImagenesPlanillone } from 'src/common/db/imagenes-planillone.entity';
import { Mesa } from 'src/common/db/mesa.entity';

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
