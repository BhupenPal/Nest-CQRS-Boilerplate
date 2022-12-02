import { Module } from '@nestjs/common';
import { ConfigServiceModule } from './configservice.module';

@Module({
  imports: [ConfigServiceModule],
  providers: [],
})
export class CommonModule {}
