import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Personero } from '../../common/db/personero.entity';
import { JwtPayload } from '../../common/interfaces/interface';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Personero)
    private readonly personeroRepository: Repository<Personero>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { dni, password } = dto;

    const personero = await this.personeroRepository.findOne({
      where: { DNI: dni },
      relations: {
        mesa: true,
      },
    });

    if (!personero) {
      throw new HttpException('Usuario no encontrado', 404);
    }

    const isPasswordValid = await compare(password, personero.Contrasena || '');

    if (!isPasswordValid) {
      throw new HttpException('Usuario no encontrado', 401);
    }

    const payload = {
      dni: personero.DNI,
      nroMesa: personero.mesa?.Numero_Mesa || '',
    };

    const token = this.jwtService.sign(payload);

    delete personero.Contrasena;

    return {
      token,
      user: personero,
    };
  }
}
