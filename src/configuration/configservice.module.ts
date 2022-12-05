import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvs } from '../constants/env.var';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      // ignoreEnvFile: true,
      cache: true,
      validate: validateEnvs,
    }),
  ],
})
export class ConfigServiceModule {}
