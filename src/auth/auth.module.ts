import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserCQRS, UserModule } from 'src/user/user.module';

@Module({
  imports: [CqrsModule, PassportModule, UserModule],
  providers: [...UserCQRS],
  controllers: [AuthController],
})
export class AuthModule {}
