import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, Repository } from 'typeorm';
import { RegistroVotosDto } from './dto/registrar-votos.dto';
import { JwtPayload } from '../../common/interfaces/interface';
import { EscrutinioMesa } from '../../common/db/escrutinio-mesa.entity';
import { VotosCandidato } from '../../common/db/votos-candidato.entity';
import { PartidosPolitico } from '../../common/db/partidos-politico.entity';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { ImagenesPlanillone } from '../../common/db/imagenes-planillone.entity';
import { Mesa } from '../../common/db/mesa.entity';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class VotosService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(PartidosPolitico)
    private readonly partidosRepository: Repository<PartidosPolitico>,
    @InjectRepository(EscrutinioMesa)
    private readonly escrutinioMesaRepository: Repository<EscrutinioMesa>,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(ImagenesPlanillone)
    private readonly imagenesPlanilloneRepository: Repository<ImagenesPlanillone>,
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async registrarVotos(votos: RegistroVotosDto, user: JwtPayload) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const {
      totalCiudadanos,
      votosBlanco,
      votosNulos,
      votosImpugnados,
      votosImpugnadosSp,
      votosPartidos,
      nroMesa,
    } = votos;

    const idsPartidos = Object.keys(votosPartidos).map((id) => Number(id));

    const partidos = await this.partidosRepository.find({
      where: {
        IdPartido: In(idsPartidos),
      },
      relations: {
        candidatos: true,
      },
    });

    try {
      //ZONA HORARIA LIMA
      const date = new Date();
      // Ajustar la fecha a la zona horaria de Lima
      date.setHours(date.getHours() - 5);

      await queryRunner.manager.insert(EscrutinioMesa, {
        NumeroMesa: nroMesa,
        VotosBlancos: votosBlanco,
        VotosNulos: votosNulos,
        VotosImpugnados: votosImpugnados,
        votosImpugnadosSp: votosImpugnadosSp,
        TotalCiudadanosVotaron: totalCiudadanos,
        EstadoActa: 'PROCESADO',
        FechaRegistro: date,
        UsuarioRegistro: user.dni,
      });

      await Promise.all(
        Object.entries(votosPartidos).map(([partido, cantidad]) => {
          const findPartido = partidos.find(
            (p) => p.IdPartido === Number(partido),
          );
          if (!findPartido) {
            throw new HttpException(
              `El partido con ID ${partido} no existe`,
              400,
            );
          }

          return queryRunner.manager.insert(VotosCandidato, {
            NumeroMesa: nroMesa,
            IdCandidato: findPartido.candidatos[0].IdCandidato,
            CantidadVotos: cantidad,
          });
        }),
      );

      await queryRunner.commitTransaction();
      return { message: 'Votos registrados correctamente' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error al registrar los votos:', error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Error al registrar los votos', 500);
    }
  }

  async deleteVotos(nroMesa: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const imagenes = await this.imagenesPlanilloneRepository.find({
      where: { NumeroMesa: nroMesa },
      select: {
        IdImagen: true,
        public_id: true,
      },
    });

    try {
      await queryRunner.manager.delete(ImagenesPlanillone, {
        NumeroMesa: nroMesa,
      });

      if (imagenes.length > 0) {
        const filtrados = imagenes.filter(
          (imagen) => imagen.public_id !== null,
        );

        await Promise.all(
          filtrados.map(async (imagen) => {
            if (imagen.public_id) {
              await this.cloudinaryService.deleteImage(imagen.public_id);
            }
          }),
        );
      }

      await queryRunner.manager.delete(VotosCandidato, {
        NumeroMesa: nroMesa,
      });

      await queryRunner.manager.delete(EscrutinioMesa, {
        NumeroMesa: nroMesa,
      });

      await queryRunner.commitTransaction();
      return { message: 'OK' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Error al eliminar los votos', 500);
    }
  }

  async verActaCerrada(nroMesa: string) {
    const acta = await this.escrutinioMesaRepository.findOne({
      where: { NumeroMesa: nroMesa },
      select: {
        NumeroMesa: true,
      },
    });

    return { nroMesa: acta?.NumeroMesa || '' };
  }

  async getActas(nroMesa: string) {
    return this.imagenesPlanilloneRepository.find({
      where: { NumeroMesa: nroMesa },
    });
  }

  async subirActas(files: Express.Multer.File[], nroMesa: string) {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const result = await this.cloudinaryService.uploadImage(file);

        return {
          secure_url: result.secure_url,
          originalName: file.originalname,
          public_id: result.public_id,
        };
      }),
    );

    console.log('Archivos subidos a Cloudinary:', uploadedFiles[0]);

    const FechaSubida = new Date();

    FechaSubida.setHours(FechaSubida.getHours() - 5); // Ajustar la fecha a la zona horaria de Lima

    const imagenes = uploadedFiles.map((file) => {
      const imagen = this.imagenesPlanilloneRepository.create({
        NumeroMesa: nroMesa,
        RutaArchivo: file.secure_url,
        NombreOriginal: file.originalName,
        FechaSubida,
        public_id: file.public_id,
      });
      return imagen;
    });

    return await this.imagenesPlanilloneRepository.save(imagenes);
  }

  async resumen(dto: QueryDto) {
    const { page, limit, nroMesa } = dto;

    const [mesas, total] = await this.mesaRepository.findAndCount({
      where: nroMesa ? { Numero_Mesa: Like(`${nroMesa}%`) } : {},
      relations: {
        escrutinioMesa: {
          votosCandidatoes: {
            candidato: {
              partidosPolitico: true,
            },
          },
        },
        imagenesPlanillones: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const metadata = {
      totalItems: total,
      itemCount: mesas.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };

    return {
      data: mesas,
      metadata,
    };
  }

  async getResumenGeneral() {
    const sp = 'exec usp_ReporteVotosPorMesa';

    const result = await this.dataSource.query(sp);

    return result;
  }
}
