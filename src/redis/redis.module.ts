import { Module, CacheModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as RedisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: RedisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
