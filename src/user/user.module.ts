import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserCommandHandler } from './commands/handler';
import { UserEventHandler } from './events/handler';
import { UserQueryHandler } from './queries/handler';
import { UserSagaHandler } from './sagas';
import { UserController } from './user.controller';

export const UserCQRS = [
  ...UserCommandHandler,
  ...UserQueryHandler,
  ...UserEventHandler,
  ...UserSagaHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [...UserCQRS],
  exports: [...UserCQRS],
})
export class UserModule {}
