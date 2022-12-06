import { Global, Module } from '@nestjs/common';
import { AnalyticsDB } from './analytics.service';
import { PrimaryDB } from './primary.service';

@Global()
@Module({
  providers: [AnalyticsDB, PrimaryDB],
  exports: [AnalyticsDB, PrimaryDB],
})
export class PrismaModule {}
