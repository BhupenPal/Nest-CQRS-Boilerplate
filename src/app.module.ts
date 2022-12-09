import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { RedisModule } from '@app/redis';
import { ConfigModule } from './configuration/configservice.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule, RedisModule, UserModule, AuthModule, DatabaseModule],
})
export class AppModule {}
