import { Module } from '@nestjs/common';
import { ConfigModule } from './configuration/configservice.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [ConfigModule, RedisModule, UserModule, AuthModule, PrismaModule],
})
export class AppModule {}
