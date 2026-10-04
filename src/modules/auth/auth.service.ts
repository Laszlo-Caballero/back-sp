import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Personero } from '../../common/db/personero.entity';
import { JwtPayload } from '../../common/interfaces/interface';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Personero)
    private readonly personeroRepository: Repository<Personero>,
    private readonly jwtService: JwtService,
  ) {}

  private passwordHashed =
    '$2b$10$YFut40wG4NQgF3MOw01ee.nhXuZEINfwP1i0fjUib0xInBpzN7o.q';

  async login(dto: LoginDto) {
    const { dni, password } = dto;

    const isPasswordValid = await compare(password, this.passwordHashed || '');

    if (!isPasswordValid) {
      throw new HttpException('Usuario no encontrado', 401);
    }

    const role = dni === 'admin' ? 'admin' : 'user';

    const payload = {
      dni,
      role,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        dni,
        role,
      },
    };
  }
}
