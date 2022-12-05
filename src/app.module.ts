import { Module } from '@nestjs/common';
import { ConfigModule } from './configuration/configservice.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule, UserModule, AuthModule, PrismaModule],
})
export class AppModule {}
