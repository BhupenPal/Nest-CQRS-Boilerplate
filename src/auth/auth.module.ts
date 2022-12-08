import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { UserCQRS } from 'src/user/user.module';

@Module({
  imports: [CqrsModule, ...UserCQRS],
  controllers: [AuthController],
})
export class AuthModule {}
