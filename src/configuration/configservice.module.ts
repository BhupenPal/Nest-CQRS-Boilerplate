import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { config } from '../constants/env.var';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      // cache: true,
      // load: [config],
    }),
  ],
})
export class ConfigServiceModule {}
