import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Payments-ms');
  const app = await NestFactory.create(AppModule);
  logger.log(`Payments-ms is running on: ${envs.port}`);
  await app.listen(envs.port);
}
bootstrap();
