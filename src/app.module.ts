import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartidosModule } from './modules/partidos/partidos.module';
import { VotosModule } from './modules/votos/votos.module';
import { MesaModule } from './modules/mesa/mesa.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      name: 'default',
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 1433),
        username: configService.get<string>('DB_USER', 'sa'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'master'),
        entities: [
          __dirname + '/common/db/**/*.entity{.ts,.js}',
          __dirname + '/modules/**/entities/*.entity{.ts,.js}',
        ],
        options: {
          encrypt: configService.get<string>('DB_ENCRYPT', 'false') === 'true',
          trustServerCertificate:
            configService.get<string>('DB_TRUST_CERT', 'true') === 'true',
        },
        connectionTimeout: 60000, // 30s en vez de los 15s por defecto
        requestTimeout: 60000, // 30s en vez de los 15s por defecto
        extra: {
          pool: {
            max: 20,
            min: 3,
            idleTimeoutMillis: 60000, // 60s en vez de los 30s por defecto
            acquireTimeoutMillis: 30000,
          },
        },
      }),
    }),
    AuthModule,
    PartidosModule,
    VotosModule,
    MesaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
