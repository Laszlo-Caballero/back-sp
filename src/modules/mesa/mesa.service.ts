import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mesa } from 'src/common/db/mesa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa) private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async getMesaByNro(nroMesa: string) {
    const mesa = await this.mesaRepository.findOne({
      where: { Numero_Mesa: nroMesa },
    });

    if (!mesa) {
      throw new HttpException(`Mesa con número ${nroMesa} no encontrada`, 404);
    }

    return mesa;
  }
}
