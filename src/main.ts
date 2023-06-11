import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';

import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
