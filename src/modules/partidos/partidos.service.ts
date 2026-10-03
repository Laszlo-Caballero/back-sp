import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartidosPolitico } from '../../common/db/partidos-politico.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(PartidosPolitico)
    private readonly partidosRepository: Repository<PartidosPolitico>,
  ) {}

  async getPartidos(): Promise<PartidosPolitico[]> {
    return this.partidosRepository.find();
  }
}
