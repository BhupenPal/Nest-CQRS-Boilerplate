import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserCommandHandler } from './commands/handler';
import { UserEventHandler } from './events/handler';
import { UserQueryHandler } from './queries/handler';
import { UserSagaHandler } from './sagas';
import { UserController } from './user.controller';

export const UserCQ = [...UserCommandHandler, ...UserQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [...UserCQ, ...UserEventHandler, ...UserSagaHandler],
  exports: [...UserCQ],
})
export class UserModule {}
