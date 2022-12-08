import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../prisma/generated/analytics';

@Injectable()
export class AnalyticsDB extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super({ datasources: { db: { url: config.get('ANALYTICS_DB_URL') } } });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
