// NEST.JS
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

// FASTIFY
import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import { FastifyInstance } from 'fastify';

// APP
import { AppModule } from './app.module';

// PRISMA SERVICE - FOR GRACEFUL SHUTDOWN
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  await app.register(fastifyCookie);
  await app.register(fastifyCsrf);

  const fastify = app.getHttpAdapter().getInstance() as FastifyInstance;

  fastify.addHook('onRequest', (req, res, next) => {
    if (req.method === 'GET') {
      return next();
    }

    return fastify.csrfProtection(req, res, next);
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(configService.get<number>('PORT'), '0.0.0.0');
}
bootstrap();
