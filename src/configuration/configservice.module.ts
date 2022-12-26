import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validateEnvs } from './env.var';
import { existsSync } from 'fs';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: existsSync('.env'),
      cache: true,
      validate: validateEnvs,
    }),
  ],
})
export class ConfigModule {}
