import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserHandler } from './queries/handler/get-user.handler';
import { UserController } from './user.controller';

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [GetUserHandler],
})
export class UserModule {}
