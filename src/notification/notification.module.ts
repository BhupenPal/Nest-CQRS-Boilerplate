import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [CqrsModule],
  controllers: [NotificationController],
  providers: [NotificationGateway],
})
export class NotificationModule {}
