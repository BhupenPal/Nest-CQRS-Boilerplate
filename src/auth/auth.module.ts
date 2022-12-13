import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserCQ, UserModule } from 'src/user/user.module';
import { AuthGateway } from './auth.gateway';

@Module({
  imports: [CqrsModule, PassportModule, UserModule],
  providers: [...UserCQ, AuthGateway],
  controllers: [AuthController],
})
export class AuthModule {}
