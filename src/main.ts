// NEST.JS
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
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
import { PrimaryDB, AnalyticsDB } from '@app/database';

// SWAGGER - API DOCUMENTATION
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      caseSensitive: false,
      ignoreTrailingSlash: true,
      trustProxy: true,
    }),
  );

  const configService = app.get(ConfigService);

  await app.register(fastifyCookie);
  await app.register(fastifyCsrf);

  const fastify = app.getHttpAdapter().getInstance() as FastifyInstance;

  fastify.addHook('onRequest', (req, res, next) => {
    // if (req.method === 'GET') {
    return next();
    // }

    return fastify.csrfProtection(req, res, next);
  });

  // SWAGGER SETUP
  const swaggerOptions = new DocumentBuilder()
    .setTitle('NEST CQRS Boilerplate')
    .setDescription('')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('/apidoc', app, swaggerDocument);

  // SHUTTING DOWN PRISMA SERVICES
  const primaryDB = app.get(PrimaryDB);
  await primaryDB.enableShutdownHooks(app);

  const analyticsDB = app.get(AnalyticsDB);
  await analyticsDB.enableShutdownHooks(app);

  // ADDDING CLASS VALIDATION AND TRANSFORMER PIPE
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  // EXPOSING PORT
  await app.listen(configService.get<number>('PORT'), '0.0.0.0');

  // HOTMODULE REPLACEMENT
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
