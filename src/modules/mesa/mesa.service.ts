import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mesa } from 'src/common/db/mesa.entity';
import { Repository } from 'typeorm';
import { MesaDto } from './dto/mesa.dto';

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

  async createMesa(createMesaDto: MesaDto) {
    const { nroMesa, distrito, capacidad } = createMesaDto;

    const newMesa = this.mesaRepository.create({
      Numero_Mesa: nroMesa,
      Distrito: distrito,
      Electores_Por_Mesa: capacidad,
    });

    return await this.mesaRepository.save(newMesa);
  }
}
