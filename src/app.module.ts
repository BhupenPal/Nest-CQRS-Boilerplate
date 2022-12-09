import { Module } from '@nestjs/common';
import { ConfigModule } from './configuration/configservice.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from '@app/database';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [ConfigModule, RedisModule, UserModule, AuthModule, DatabaseModule],
})
export class AppModule {}
