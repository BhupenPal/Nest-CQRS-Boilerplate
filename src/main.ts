// NEST.JS
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from 'fastify-csrf';
import { AppModule } from './app.module';
import { FastifyInstance } from 'fastify';

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

  await app.listen(configService.get<number>('PORT'), '0.0.0.0');
}
bootstrap();
