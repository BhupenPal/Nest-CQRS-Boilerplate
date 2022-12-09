import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { UserCQRS, UserModule } from 'src/user/user.module';

@Module({
  imports: [CqrsModule, UserModule],
  providers: [...UserCQRS],
  controllers: [AuthController],
})
export class AuthModule {}
